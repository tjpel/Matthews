'use client';

import { createContext, useCallback, useContext, useMemo, useEffect, useState, KeyboardEvent, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSwitchTransition } from 'transition-hook';
import { Updater, useImmer } from 'use-immer';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AutocompleteResponse } from '@/radar-util';

import * as schema from '@/schema';
import { PropertyData } from '@/schema';
import * as radar from "@/radar-util";
import {SuggestionInput} from '@/components/suggestion-input';

import styles from './page.module.css';
import 'radar-sdk-js/dist/radar.css';

// Prevents spam to Radar API
const REQUEST_DELAY_MS = 500;

const ANIM_SECS = 0.2;

type ButtonAction = (ev?: MouseEvent) => void;

interface FormState {
  step: number;
  data: {
    address: string;
    property: PropertyData
  };
}

const FORM_STATE: FormState = {
  step: 0,
  data: {
    address: '',
    property: {
      netIncome: 0,
      buildingSF: 0,
      parkingSpaces: 0,
      studioUnits: 0,
      oneBedroomUnits: 0,
      twoBedroomUnits: 0,
      threeBedroomUnits: 0
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
  const transition = useSwitchTransition(step, ANIM_SECS * 1000, 'out-in');

  useEffect(() => {
    radar.init();
    radar.createMap("map");

    return () => radar.removeMap();
  }, []);

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
      <div className={styles.formScroll}>
        {transition((step, state) => (
          <div
            className={styles.formWrapper}
            style={{
              transition: `all ${ANIM_SECS}s ${state === 'leave' ? 'ease-in' : 'ease-out'}`,
              opacity: state === 'enter' ? 1 : 0,
              transform: `translateY(${{
                "enter": 0,
                "from": "-2em",
                "leave": "2em"
              }[state]})`
            }}
          >
            {step === 0 && <GetAddress home={home} next={next} />}
            {step === 1 && <PropertyInfo back={back} next={next}/>}

            {step === 2 && <>unimplemented :P</>}
          </div>
        ))}
      </div>

      <div style={{position: "relative"}}>
        <div id="map" style={{width: '100%', height: '100%'}}/>
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

  const [currentValue, setCurrentValue] = useState("");
  const [autocomplete, setAutocomplete] = useState<AutocompleteResponse>([]);
  const [handle, setHandle] = useState<number>();

  // for live address suggestions
  const onChange = useCallback(() => {
    if (handle) clearTimeout(handle);

    // @ts-ignore
    setHandle(setTimeout(() => {
      const address = getValues("address");
      setCurrentValue(address);
      console.log(autocomplete);
      if (address.length > 0) {
        radar.geocode(address).then(address => {
          if (address) {
            radar.setMapMarker(address);
          }
        });
        radar.autocomplete(address).then(setAutocomplete);
      } else {
        setAutocomplete([]);
      }
    }, REQUEST_DELAY_MS));
  }, [handle, autocomplete, setCurrentValue, setHandle]);

  const onBlur = () => {
    setAutocomplete([]);
  };
  const onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape')
      setAutocomplete([]);
  };
  const onSelect = (address: string) => {
    console.log("setting to ", address);
    setValue("address", address);
    setAutocomplete([]);
  };
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // should be set by onChange, but setting again just to be safe
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
      <button className='primary'>Continue</button>
      <button onClick={props.home}>Back to home</button>
    </div>
  </form>;
}

function PropertyInfo(props: {
  back: ButtonAction,
  next: ButtonAction
}) {
  const {form, setForm} = useContext(FormStateContext);
  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(schema.property),
    defaultValues: form.data.property
  });

  const onSubmit = (data: PropertyData) => {
    console.log(data);
    setForm(_form => {

    });
    props.next();
  }

  return <form onSubmit={handleSubmit(onSubmit)}>
    <h1>Multifamily Information</h1>
    <sub>Add your property information so we can provide you with an accurate property estimation report.</sub>

    <label>$ Net Income</label>
    <input type='number' {...register("netIncome", {valueAsNumber: true})}/>
    <span className="form-error">{errors.netIncome?.message}</span>

    <label>Building Size (square feet)</label>
    <input type='number' {...register("buildingSF", {valueAsNumber: true})}/>
    <span className="form-error">{errors.buildingSF?.message}</span>

    <label>Number of Parking Spaces</label>
    <input type='number' {...register("parkingSpaces", {valueAsNumber: true})}/>
    <span className="form-error">{errors.parkingSpaces?.message}</span>

    <label>Number of Studio Units</label>
    <input type='number' {...register("studioUnits", {valueAsNumber: true})}/>
    <span className="form-error">{errors.studioUnits?.message}</span>

    <label>Number of 1 Bedroom Units</label>
    <input type='number' {...register("oneBedroomUnits", {valueAsNumber: true})}/>
    <span className="form-error">{errors.oneBedroomUnits?.message}</span>

    <label>Number of 2 Bedroom Units</label>
    <input type='number' {...register("twoBedroomUnits", {valueAsNumber: true})}/>
    <span className="form-error">{errors.twoBedroomUnits?.message}</span>

    <label>Number of 3 Bedroom Units</label>
    <input type='number' {...register("threeBedroomUnits", {valueAsNumber: true})}/>
    <span className="form-error">{errors.threeBedroomUnits?.message}</span>

    <div className={styles.controls}>
      <button className="primary">Your property estimate</button>
      <button onClick={props.back}>Previous step</button>
    </div>
  </form>
}
