import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { contactSchema } from '@/schemas/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from './ui/textarea';

export const ContactForm = ({ onSubmit }: { onSubmit?: any }) => {
  // If no custom onSubmit, send contact info to database
  if (!onSubmit) onSubmit = (data: any) => console.log(data);

  const contactForm = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: ''
    }
  });

  return (
    <Form {...contactForm}>
      <form onSubmit={contactForm.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={contactForm.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="space-y-1 w-full">
              <Label>
                First Name
                <span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <Input
                  placeholder="Enter your first name"
                  className="h-12"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={contactForm.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="space-y-1 w-full">
              <Label>
                Last Name<span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <Input
                  placeholder="Enter your last name"
                  className="h-12"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={contactForm.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1 w-full">
              <Label>
                Email<span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  className="h-12"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={contactForm.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="space-y-1 w-full">
              <Label>
                Phone<span className="text-red-500">*</span>
              </Label>
              <FormControl>
                <Input
                  placeholder="Enter your phone number"
                  className="h-12"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={contactForm.control}
          name="message"
          render={({ field }) => (
            <FormItem className="space-y-1 w-full">
              <Label>Message</Label>
              <FormControl>
                <Textarea placeholder="Enter a message!" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
