'use client';

import { createContext, KeyboardEvent, MouseEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSwitchTransition } from 'transition-hook';
import { Updater, useImmer } from 'use-immer';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import * as radar from '@/radar-util';
import { AutocompleteResponse } from '@/radar-util';
import * as schema from '@/schema';
import { ContactData, PropertyData } from '@/schema';
import { Input } from '@/components/input';
import { SuggestionInput } from '@/components/suggestion-input';
import { Arrow } from '@/svg/arrow';
import * as format from '@/format';
import * as bridge from '@/bridge';

import styles from './page.module.css';
import 'radar-sdk-js/dist/radar.css';
import { ButtonAction } from './types';
import { ContactForm } from './contact';
import { PriceRange } from '@/components/price-range';

// Prevents spam to Radar API
const REQUEST_DELAY_MS = 500;

const ANIM_SECS = 0.2;
const ANIM_MS = ANIM_SECS * 1000;

interface FormState {
  step: number;
  prediction: number | undefined;
  data: {
    address: string;
    property: Partial<PropertyData>
  };
}

const FORM_STATE: FormState = {
  step: 0,
  prediction: undefined,
  data: {
    address: '',
    property: {
      netIncome: undefined,
      buildingSF: undefined,
      parkingSpaces: undefined,
      studioUnits: undefined,
      oneBedroomUnits: undefined,
      twoBedroomUnits: undefined,
      threeBedroomUnits: undefined
    }
  }
};

const FormStateContext = createContext<{
  form: FormState,
  setForm: Updater<FormState>
}>({
  form: FORM_STATE,
  setForm: () => {
  }
});

export default function Page() {
  const router = useRouter();
  const [form, setForm] = useImmer(FORM_STATE);

  const step = useMemo(() => form.step, [form]);
  const [animStep, setAnimStep] = useState(step);
  const transition = useSwitchTransition(step, ANIM_MS, 'out-in');

  useEffect(() => {
    radar.init();
    radar.createMap('map');

    return () => radar.removeMap();
  }, []);

  useEffect(() => {
    // extra delay if setting to first step so that there's no chance of flickering
    if (step === 0)
      setTimeout(() => setAnimStep(step), ANIM_MS * 1.5);
    else
      setTimeout(() => setAnimStep(step), ANIM_MS);
  }, [step]);

  const home = useCallback((ev?: MouseEvent) => {
    ev?.preventDefault();
    router.push('/');
  }, [router]);

  const back = useCallback((ev?: MouseEvent) => {
    ev?.preventDefault();
    setForm(form => {
      form.step -= 1;
    });
  }, [setForm]);

  const next = useCallback(() => {
    setForm(form => {
      form.step += 1;
    });
  }, [setForm]);

  return <FormStateContext.Provider value={{ form, setForm }}>
    <div className={styles.estimator}>
      <div className={styles.formScroll} style={{
        '--overflow': animStep === 0 ? 'visible' : 'scroll'
      }}>
        {transition((step, state) => (
          <div
            className={styles.formWrapper}
            style={{
              transition: `all ${ANIM_SECS}s ${state === 'leave' ? 'ease-in' : 'ease-out'}`,
              opacity: state === 'enter' ? 1 : 0,
              transform: `translateY(${{
                'enter': 0,
                'from': '-2em',
                'leave': '2em'
              }[state]})`
            }}
          >
            {step === 0 && <GetAddress home={home} next={next} />}
            {step === 1 && <PropertyInfo back={back} next={next} />}

            {step === 2 && <ResultsWithContact back={back} />}
          </div>
        ))}
      </div>

      <div className={styles.mapWrapper}>
        <div id='map' style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  </FormStateContext.Provider>;
}

function GetAddress(props: {
  home: ButtonAction,
  next: ButtonAction
}) {
  const formSchema = z.object({
    address: schema.address
  });
  const { form, setForm } = useContext(FormStateContext);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: form.data.address
    }
  });

  const [currentValue, setCurrentValue] = useState('');
  const [autocomplete, setAutocomplete] = useState<AutocompleteResponse>([]);
  const [handle, setHandle] = useState<number>();

  // for live address suggestions
  const onChange = useCallback(() => {
    const address = getValues('address');
    setCurrentValue(getValues('address'));
    if (address.length > 0) {
      radar.autocomplete(address).then(setAutocomplete);
    } else {
      setAutocomplete([]);
    }
  }, [setCurrentValue, setAutocomplete]);

  // set main map position
  useEffect(() => {
    if (handle) clearTimeout(handle);

    // @ts-ignore
    setHandle(setTimeout(() => {
      if (currentValue.length > 0) {
        radar.geocode(currentValue).then(address => {
          if (address) {
            radar.setMapMarker(address);
          }
        });
      }
    }, REQUEST_DELAY_MS));
  }, [currentValue, setHandle]);

  const onBlur = () => {
    setAutocomplete([]);
  };
  const onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape')
      setAutocomplete([]);
  };
  const onSelect = (address: string) => {
    setValue('address', address);
    setCurrentValue(address);
    setAutocomplete([]);
  };
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setForm(form => {
      form.data.address = data.address;
    });
    props.next();
  };

  return <form onSubmit={handleSubmit(onSubmit)}>
    <h1>Find out what your multifamily property is really worth</h1>
    <sub>Enter an address, and our AI will do the rest.</sub>

    <SuggestionInput
      register={register('address', { onChange })}
      error={!!errors.address}
      suggestions={autocomplete
        .map(address => address.formattedAddress!)
        .filter(Boolean)}
      currentText={currentValue}

      onSelect={onSelect}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    />

    <span className='form-error'>
      {errors.address?.message}
    </span>

    <div className={styles.controls}>
      <button className='primary'>Continue<Arrow /></button>
      <button onClick={props.home}>Back to home</button>
    </div>
  </form>;
}

function PropertyInfo(props: {
  back: ButtonAction,
  next: ButtonAction
}) {
  const { form, setForm } = useContext(FormStateContext);
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<PropertyData>({
    resolver: zodResolver(schema.property),
    defaultValues: form.data.property as PropertyData
  });

  const onChange = () => {
    setForm(form => {
      form.data.property = getValues();
    });
  };

  const onSubmit = () => {
    onChange();
    props.next();
  };

  const inputProps = (name: keyof PropertyData) =>
    ({
      register: register(name, {
        setValueAs: (value: string | number) =>
          typeof value === 'string' ? Number(value.replaceAll(',', '')) : value,
        onChange
      }),
      error: errors[name],
      format: format.number()
    });

  return <form onSubmit={handleSubmit(onSubmit)}>
    <h1>Multifamily Information</h1>
    <sub>Add your property information so we can provide you with an accurate property estimation report.</sub>

    <Input {...inputProps('netIncome')}>$ Net Income</Input>

    <Input {...inputProps('buildingSF')}>Building Size (square feet)</Input>

    <Input {...inputProps('parkingSpaces')}>Number of Parking Spaces</Input>

    <Input {...inputProps('studioUnits')}>Number of Studio Units</Input>

    <Input {...inputProps('oneBedroomUnits')}>Number of 1 Bedroom Units</Input>

    <Input {...inputProps('twoBedroomUnits')}>Number of 2 Bedroom Units</Input>

    <Input {...inputProps('threeBedroomUnits')}>Number of 3 Bedroom Units</Input>

    <div className={styles.controls}>
      <button className='primary'>Your property estimate<Arrow /></button>
      <button onClick={props.back}>Previous step</button>
    </div>
  </form>;
}

function ResultsWithContact(props: {
  back: ButtonAction
}) {
  const { form, setForm } = useContext(FormStateContext);

  useEffect(() => {
    bridge.predict(form.data.property as PropertyData).then(res => {
      setForm(form => {
        form.prediction = res.prediction;
      });
    });
  }, [form.data.property]);

  const onSubmit = async (data: ContactData) => {
    await bridge.record({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      address: form.data.address,
      result: form.prediction!
    });

    setForm(form => {
      form.step += 1;
    });
  };

  return <div>
    { form.prediction === undefined ?
      <div className={styles.loading}>
        Loading
      </div>
    :
      <div>
        <h1>Estimate:</h1>
        <PriceRange price={Math.ceil(form.prediction)} />
      </div>}

    <hr/>

    <ContactForm back={props.back} onSubmit={onSubmit} />
  </div>;
}
