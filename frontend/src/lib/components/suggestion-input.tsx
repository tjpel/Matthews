import { UseFormRegisterReturn } from 'react-hook-form';
import { KeyboardEvent, useEffect, useState, useRef } from 'react';

import { classes } from '@/util';

import styles from './suggestion-input.module.css';

export function SuggestionInput(props: {
  register: UseFormRegisterReturn<string>,
  suggestions: string[],
  currentText?: string,
  error?: boolean,

  onSelect?: (option: string) => void,
  onBlur?: () => void,
  onKeyDown?: (ev: KeyboardEvent) => void
}) {
  const [shown, setShown] = useState(false);

  let div = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.suggestions.length === 0)
      setShown(false);
    if (props.suggestions.length === 1)
      setShown(props.suggestions[0] != props.currentText);
    else
      setShown(true);
  }, [props.suggestions, props.currentText, setShown]);

  useEffect(() => {
    const click = (ev: MouseEvent) => {
      let elem: Element | null = ev.target as Element | null;
      while (elem) {
        if (elem === div.current) {
          props.onBlur?.();
          break;
        } else {
          elem = elem.parentElement;
        }
      }
    };

    if (props.onBlur) {
      window.addEventListener("click", click);
      return () => {
        window.removeEventListener("click", click);
      };
    }
  }, [div, props.onBlur]);

  return <div ref={div} className={styles.wrapper}>
    <input
      autoComplete='off'
      className={props.error ? 'error' : ''}
      onKeyDown={props.onKeyDown}
      {...props.register}
    />
    <div className={classes({
      [styles.suggestions]: true,
      [styles.hidden]: !shown
    })}>
      {props.suggestions.map(suggestion => (
        <button
          key={suggestion}
          onClick={ev => {
            ev.preventDefault();
            props.onSelect?.(suggestion);
          }}
        >{suggestion}</button>
      ))}
    </div>
  </div>;
}
