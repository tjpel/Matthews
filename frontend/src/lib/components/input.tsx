import { ChangeEvent, HTMLInputTypeAttribute, ReactNode, useEffect, useRef } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

export type Formatter = (source: string, pos: number) => [string, number | undefined];

export function Input(props: {
  type?: HTMLInputTypeAttribute | 'textarea',
  register: UseFormRegisterReturn<string>,
  error?: FieldError,
  format?: Formatter,

  children: ReactNode
}) {
  let input = useRef<HTMLInputElement | HTMLTextAreaElement | undefined>(undefined);

  const update = () => {
    const node = input.current;
    if (!node || !props.format) return;
    const [value, pos] = props.format(node.value, node.selectionStart || 0);
    node.value = value;
    if (pos !== undefined)
      node.setSelectionRange(pos, pos);
  };

  useEffect(() => {
    update();
  }, []);

  const opts = {
    ...props.register,
    onChange(ev: ChangeEvent) {
      props.register.onChange(ev);
      update();
    },
    ref(node: any) {
      props.register.ref(node);
      input.current = node;
    }
  };

  return <>
    <label>{props.children}</label>
    {props.type === 'textarea' ?
      <textarea
        className={props.error ? 'error' : ''}
        {...opts}
      />
      :
      <input
        type={props.type}
        className={props.error ? 'error' : ''}
        {...opts}
      />
    }
    <span className='form-error'>{props.error?.message}</span>
  </>;
}
