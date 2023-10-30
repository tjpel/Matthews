'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ButtonAction } from './types';
import { Input } from '@/components/input';
import { Arrow } from '@/svg/arrow';
import { contact, ContactData } from '@/schema';
import * as format from '@/format';

import styles from './page.module.css';

export function ContactForm(props: {
  back?: ButtonAction,
  onSubmit: (data: ContactData) => void
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<ContactData>({
    resolver: zodResolver(contact)
  });

  const onSubmit = (data: ContactData) => {
    props.onSubmit(data);
  };


  return <form onSubmit={handleSubmit(onSubmit)}>
    <h1>Contact Us</h1>
    <sub>
      Add your contact info to get an in-depth property
      estimation report from one of our agents.
    </sub>

    <Input register={register('name')} error={errors.name}>
      Name
    </Input>

    <Input type='email' register={register('email')} error={errors.email}>
      Email
    </Input>

    <Input type='tel' register={register('phone')} error={errors.phone} format={format.phone()}>
      Phone
    </Input>

    <Input type='textarea' register={register('message')} error={errors.message}>
      Message
    </Input>

    <div className={styles.controls}>
      <button className='primary'>Submit Contact Info <Arrow /></button>
      {props.back && <button onClick={props.back}>Previous step</button>}
    </div>
  </form>;
}
