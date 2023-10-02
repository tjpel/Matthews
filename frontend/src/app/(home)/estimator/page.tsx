"use client"

import Radar from 'radar-sdk-js';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { AnimatePresence, motion } from "framer-motion";
import { RadioGroup } from "@headlessui/react";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useQuery } from '@tanstack/react-query';
import { bridge } from '@/lib/bridge';
import axios from 'axios';

const questions = [
  {
    id: 1,
    name: "1 Bedroom",
    description: "Single bedroom properties",
    difficulty: 1,
  },
  {
    id: 2,
    name: "2 Bedrooms",
    description: "Two-bedroom properties",
    difficulty: 2,
  },
  {
    id: 3,
    name: "3 Bedrooms",
    description: "Three-bedroom properties",
    difficulty: 3,
  },
  {
    id: 4,
    name: "4+ Bedrooms",
    description: "Four or more bedroom properties",
    difficulty: 4,
  },
];


const Bedrooms = [
  {
    id: "1",
    name: "1 Bedrooms",
    // description: "Software Engineering",
    level: "L1",
  },
  {
    id: "2",
    name: "2 Bedrooms",
    // description: "Software Engineering",
    level: "L2",
  },
  {
    id: "3",
    name: "3 Bedrooms",
    // description: "Software Engineering",
    level: "L3",
  },
  {
    id: "4",
    name: "4+ Bedrooms",
    // description: "Software Engineering",
    level: "L4",
  },
];

const Bathrooms = [
  {
    id: "1",
    name: "1 Bathrooms",
    // description: "Software Engineering",
    level: "L1",
  },
  {
    id: "2",
    name: "2 Bathrooms",
    // description: "Software Engineering",
    level: "L1",
  },
  {
    id: "3",
    name: "3 Bathrooms",
    // description: "Software Engineering",
    level: "L1",
  },
  {
    id: "4",
    name: "4+ Bathrooms",
    // description: "Software Engineering",
    level: "L4",
  },
];

const geometrySchema = z.object({
  type: z.string(),
  coordinates: z.array(z.number())
});

const addressSchema = z.object({
  address: z.object({
    latitude: z.number(),
    longitude: z.number(),
    geometry: geometrySchema,
    country: z.string(),
    countryCode: z.string(),
    countryFlag: z.string(),
    county: z.string(),
    distance: z.number(),
    city: z.string(),
    stateCode: z.string(),
    state: z.string(),
    layer: z.string(),
    formattedAddress: z.string(),
  })
  .refine(
    data => !!data.latitude && !!data.longitude, // Add your own validation logic here
    {
      message: "You must add a valid address", // Custom error message
    }
  ),
});

const propertySchema = z.object({
  grossIncome: z.number().refine(value => value > 0, { message: "Required" }),
  bedrooms: z.number().refine(value => !isNaN(value), { message: "Required" }),
  bathrooms: z.number().refine(value => !isNaN(value), { message: "Required" }),
  size: z.number().refine(value => value > 0, { message: "Required" }),
  buildingSF: z.number().refine(value => value > 0, { message: "Required" }),
  numberOfUnits: z.number().refine(value => value > 0, { message: "Required" }),
  numberOfFloors: z.number().refine(value => value > 0, { message: "Required" }),
  pricePerACLand: z.number().refine(value => value > 0, { message: "Required" }),
  pricePerSFLand: z.number().refine(value => value > 0, { message: "Required" }),
  numberOf1BedroomsUnits: z.number().refine(value => value >= 0, { message: "Required" }),
  numberOf2BedroomsUnits: z.number().refine(value => value >= 0, { message: "Required" }),
  floorAreaRatio: z.number().refine(value => value > 0, { message: "Required" }),
  numberOfParkingSpaces: z.number().refine(value => value >= 0, { message: "Required" }),
  numberOfStudiosUnits: z.number().refine(value => value >= 0, { message: "Required" }),
  typicalFloorSF: z.number().refine(value => value > 0, { message: "Required" }),
  numberOf3BedroomsUnits: z.number().refine(value => value >= 0, { message: "Required" }),
  landAreaAC: z.number().refine(value => value > 0, { message: "Required" }),
  landAreaSF: z.number().refine(value => value > 0, { message: "Required" }),
  starRating: z.number().refine(value => value >= 0 && value <= 5, { message: "Rating must be between 0 and 5" }),
  netIncome: z.number().refine(value => value > 0, { message: "Required" }),
  yearBuilt: z.number().refine(value => value > 0, { message: "Required" }),
  age: z.number().refine(value => value >= 0, { message: "Required" }),
});

const contactSchema = z.object({
  firstName: z.string().min(1, { message: "Required" }),
  lastName: z.string().min(1, { message: "Required" }),
  email: z.string().email({ message: "Required" }),
  phone: z.string().min(1, { message: "Required" }),
});

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function DemoPage() {
  const [selected, setSelected] = useState<{ id: number, name: string, description: string, difficulty: number }>(questions[0]);
  const [selectedBathroom, setSelectedBathroom] = useState(Bathrooms[0]);  // No type specified as per your request
  const [selectedBedroom, setSelectedBedroom] = useState(Bedrooms[0]);    // No type specified as per your request
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<null | object>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<RadarAutocompleteAddress[]>([]);
  const [addressSuggestionsOpen, setAddressSuggestionsOpen] = useState<boolean>(false);
  const [map, setMap] = useState<any>()

  useEffect(() => {
    Radar.initialize('prj_live_pk_b172f4472789be4d6feee1895fd8d1f4ff69e531');
    setIsDesktop(window.innerWidth >= 768);

    const map = new (Radar.ui.map as any)({
      container: 'map',
      style: 'radar-default-v1',
      center: [-98.5795, 39.8283], // Middle of united states
      zoom: 3,
    });

    setMap(map);

    // Cleanup function to run when the component unmounts
    return () => {
      map.remove();  // Remove the map to prevent memory leaks
    };
  }, []);

  const handleAutocomplete = async (incompleteAddress: string) => {
    try {
      console.log(incompleteAddress)

      const result = await Radar.autocomplete({
        query: incompleteAddress,
        // near: { latitude: 37.8272, longitude: -122.2913 },
        layers: ["address"],
        limit: 5,
        countryCode: "US",
      });

      const { addresses } = result;
      console.log(addresses)
      setSuggestions(addresses);
    } catch (err) {
      console.error(err);
      // handle error
    }
  };

  const addressForm = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: {},
    },
  });

  const propertyForm = useForm<z.infer<typeof propertySchema>>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      grossIncome: 0,
      bedrooms: 0,
      bathrooms: 0,
      size: 0,
      buildingSF: 0,
      numberOfUnits: 0,
      numberOfFloors: 0,
      pricePerACLand: 0,
      pricePerSFLand: 0,
      numberOf1BedroomsUnits: 0,
      numberOf2BedroomsUnits: 0,
      floorAreaRatio: 0,
      numberOfParkingSpaces: 0,
      numberOfStudiosUnits: 0,
      typicalFloorSF: 0,
      numberOf3BedroomsUnits: 0,
      landAreaAC: 0,
      landAreaSF: 0,
      starRating: 0,
      netIncome: 0,
      yearBuilt: 0,
      age: 0,
    },
  });

  const contactForm = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const watchedAddressForm = addressForm.watch();
  const watchedPropertyForm = propertyForm.watch();

  const getAddressData = async (address: string): Promise<any> =>
    await bridge.getPropertyData({ address });

  const {
    isLoading,
    error,
  } = useQuery(['addressData', { "latitude": watchedAddressForm.address?.latitude, "longitude": watchedAddressForm.address?.longitude }], async () => {
    console.log(watchedAddressForm.address.formattedAddress)
    return getAddressData(watchedAddressForm.address.formattedAddress)
  }, {
    enabled: !!watchedAddressForm.address.latitude && !!watchedAddressForm.address.longitude,
    onSuccess: data => {
      console.log("query success")
      console.log(data.response)
      console.log(data.initial_info)
      console.log(data.mls_data)
      console.log(data.avm_details)
      propertyForm.setValue("grossIncome", data.mls_data.grossIncome ?? 0);
      propertyForm.setValue("bedrooms", data.mls_data.publicRecordsInfo.basicInfo.beds ?? 0);
      propertyForm.setValue("bathrooms", data.mls_data.publicRecordsInfo.basicInfo.baths ?? 0);
      console.log(propertyForm.getValues())
    },
    retry: false,
  });

  useEffect(() => {
    const addressFormValues = addressForm.getValues();

    console.log(addressFormValues)

    if (addressFormValues.address.latitude && addressFormValues.address.longitude) {

      const newCoords:[number, number] = [addressFormValues.address.longitude, addressFormValues.address.latitude];

      const marker = Radar.ui.marker({ text: 'Property' })
        .setLngLat(newCoords)
        .addTo(map);

      map.flyTo({
        center: newCoords,
        zoom: 15,
      });

      console.log("done")
    }
  }, [addressForm, watchedAddressForm, map]);

  return (
    <AnimatePresence>
      <div className="flex flex-col md:flex-row w-full md:overflow-hidden">
        <div className="w-full min-h-[60vh] md:w-1/2 md:h-screen flex flex-col px-4 pt-2 pb-8 md:px-0 md:py-2 bg-[#FCFCFC] justify-center">
          <div className="h-full w-full items-center justify-center flex flex-col">
            {step === 1 ? (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                key="step-1"
                transition={{
                  duration: 0.95,
                  ease: [0.165, 0.84, 0.44, 1],
                }}
                className="max-w-lg mx-auto px-4 lg:px-0"
              >
                <Form {...addressForm}>
                  <form
                    onSubmit={addressForm.handleSubmit((e) => setStep(2))}
                    className="space-y-4"
                  >
                    <h2 className="text-4xl font-bold text-[#1E2B3A]">
                      Find out what your home is really worth
                    </h2>
                    <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                      Enter an adress, and our AI will do the rest. 
                    </p>
                    <div>
                      <FormField
                        control={addressForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="space-y-1 w-full">
                            <FormControl>
                              <div className="relative">
                                <Input
                                  className="h-14"
                                  placeholder='Enter your address'
                                  value={field.value.formattedAddress}
                                  onChange={(e) => {
                                    field.onChange({
                                      ...field.value,
                                      formattedAddress: e.target.value
                                    });
                                    // if (field.value.formattedAddress) {
                                    //   handleAutocomplete(field.value.formattedAddress);
                                    //   setAddressSuggestionsOpen(true);
                                    // } else {
                                    //   setSuggestions([]);
                                    // }
                                  }}
                                  onKeyUp={(e) => {
                                    if (field.value.formattedAddress) {
                                      handleAutocomplete(field.value.formattedAddress);
                                      setAddressSuggestionsOpen(true);
                                    } else {
                                      setSuggestions([]);
                                    }
                                  }}
                                />
                                {addressSuggestionsOpen && (
                                  <div style={{ position: 'absolute', zIndex: 1, backgroundColor: '#FFFFFF' }} className="z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                                    <Command className="w-full p-0">
                                      <CommandEmpty>No address found.</CommandEmpty>
                                      <CommandGroup>
                                        {suggestions.map((suggestion) => (
                                          <CommandItem
                                            className="h-10 rounded-md"
                                            key={suggestion.formattedAddress}
                                            onSelect={() => {
                                              field.onChange(suggestion);
                                              setAddressSuggestionsOpen(false);
                                            }}
                                          >
                                            {suggestion.formattedAddress}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </Command>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex gap-[15px] justify-end mt-8">
                      <div>
                        <Link
                          href="/"
                          className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] no-underline active:scale-95 scale-100 duration-75"
                          style={{
                            boxShadow: "0 1px 1px #0c192714, 0 1px 3px #0c192724",
                          }}
                        >
                          Back to home
                        </Link>
                      </div>
                      <div>
                        <button
                          // onClick={() => {
                          //   setStep(2);
                          // }}
                          type="submit"
                          className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
                          style={{
                            boxShadow:
                              "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <span> Continue </span>
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.75 6.75L19.25 12L13.75 17.25"
                              stroke="#FFF"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M19 12H4.75"
                              stroke="#FFF"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </form>
                </Form>
              </motion.div>
            ) : step === 2 ? (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                key="step-2"
                transition={{
                  duration: 0.95,
                  ease: [0.165, 0.84, 0.44, 1],
                }}
                className="max-w-lg mx-auto px-4 lg:px-0"
              >
                <Form {...propertyForm}>
                  <form
                    onSubmit={propertyForm.handleSubmit((e) => setStep(3))}
                    className="space-y-4"
                  >
                    <h2 className="text-4xl font-bold text-[#1E2B3A]">
                      More Information
                    </h2>
                    <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                      Add your property information so we can provide you with an accurate property estimation report.
                    </p>
                    <div className="space-y-4">
                      <FormField
                        control={propertyForm.control}
                        name="grossIncome"
                        render={({ field }) => (
                          <FormItem className="space-y-1 w-full">
                            <Label>$ Gross Income</Label>
                            <FormControl>
                              <Input
                                className="h-14"
                                placeholder='Enter your property gross income'
                                type="number"
                                value={field.value}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={propertyForm.control}
                        name="bathrooms"
                        render={({ field }) => (
                          <FormItem className="space-y-1 w-full">
                            <Label># Bathrooms</Label>
                            <FormControl>
                              <div className="py-1">
                                <Slider
                                  aria-label="Temperature"
                                  value={field.value}
                                  onChange={(e, value) => field.onChange(value)}
                                  // getAriaValueText={valuetext}
                                  valueLabelDisplay="auto"
                                  step={1}
                                  marks
                                  min={1}
                                  max={10}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={propertyForm.control}
                        name="bedrooms"
                        render={({ field }) => (
                          <FormItem className="space-y-1 w-full">
                            <Label># Bedrooms</Label>
                            <FormControl>
                              <div className="py-1">
                                <Slider
                                  aria-label="Temperature"
                                  value={field.value}
                                  onChange={(e, value) => field.onChange(value)}
                                  // getAriaValueText={valuetext}
                                  valueLabelDisplay="auto"
                                  step={1}
                                  marks
                                  min={1}
                                  max={10}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* <RadioGroup value={selected} onChange={setSelected}>
                        <RadioGroup.Label className="sr-only">
                          # Bedrooms
                        </RadioGroup.Label>
                        <Label># Bedrooms</Label>
                        <div className="space-y-4">
                          {questions.map((question) => (
                            <RadioGroup.Option
                              key={question.name}
                              value={question}
                              className={({ checked, active }) =>
                                classNames(
                                  checked
                                    ? "border-transparent"
                                    : "border-gray-300",
                                  active
                                    ? "border-blue-500 ring-2 ring-blue-200"
                                    : "",
                                  "relative cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none flex justify-between"
                                )
                              }
                            >
                              {({ active, checked }) => (
                                <>
                                  <span className="flex items-center">
                                    <span className="flex flex-col text-sm">
                                      <RadioGroup.Label
                                        as="span"
                                        className="font-medium text-gray-900"
                                      >
                                        {question.name}
                                      </RadioGroup.Label>
                                      <RadioGroup.Description
                                        as="span"
                                        className="text-gray-500"
                                      >
                                        <span className="block">
                                          {question.description}
                                        </span>
                                      </RadioGroup.Description>
                                    </span>
                                  </span>
                                  <RadioGroup.Description
                                    as="span"
                                    className="flex text-sm ml-4 mt-0 flex-col text-right items-center justify-center"
                                  >
                                    <span className=" text-gray-500">
                                      {question.difficulty === 1 ? (
                                        <svg
                                          className="h-full w-[16px]"
                                          viewBox="0 0 28 25"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <rect y="13.1309" width="4" height="11" rx="1" fill="#4E7BBA" />
                                          <rect x="8" y="8.13086" width="4" height="16" rx="1" fill="#E1E1E1" />
                                          <rect x="16" y="4.13086" width="4" height="20" rx="1" fill="#E1E1E1" />
                                          <rect x="24" y="0.130859" width="4" height="24" rx="1" fill="#E1E1E1" />
                                        </svg>
                                      ) : question.difficulty === 2 ? (
                                        <svg
                                          className="h-full w-[16px]"
                                          viewBox="0 0 28 25"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <rect y="13.1309" width="4" height="11" rx="1" fill="#4E7BBA" />
                                          <rect x="8" y="8.13086" width="4" height="16" rx="1" fill="#4E7BBA" />
                                          <rect x="16" y="4.13086" width="4" height="20" rx="1" fill="#E1E1E1" />
                                          <rect x="24" y="0.130859" width="4" height="24" rx="1" fill="#E1E1E1" />
                                        </svg>
                                      ) : question.difficulty === 3 ? (
                                        <svg
                                          className="h-full w-[16px]"
                                          viewBox="0 0 28 25"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <rect y="13.1309" width="4" height="11" rx="1" fill="#4E7BBA" />
                                          <rect x="8" y="8.13086" width="4" height="16" rx="1" fill="#4E7BBA" />
                                          <rect x="16" y="4.13086" width="4" height="20" rx="1" fill="#4E7BBA" />
                                          <rect x="24" y="0.130859" width="4" height="24" rx="1" fill="#E1E1E1" />
                                        </svg>
                                      ) : (
                                        <svg
                                          className="h-full w-[16px]"
                                          viewBox="0 0 28 25"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <rect y="13.1309" width="4" height="11" rx="1" fill="#4E7BBA" />
                                          <rect x="8" y="8.13086" width="4" height="16" rx="1" fill="#4E7BBA" />
                                          <rect x="16" y="4.13086" width="4" height="20" rx="1" fill="#4E7BBA" />
                                          <rect x="24" y="0.130859" width="4" height="24" rx="1" fill="#4E7BBA" />
                                        </svg>
                                      )}
                                    </span>
                                    <span className="font-medium text-gray-900">
                                      {question.difficulty}
                                    </span>
                                  </RadioGroup.Description>
                                  <span
                                    className={classNames(
                                      active ? "border" : "border-2",
                                      checked
                                        ? "border-blue-500"
                                        : "border-transparent",
                                      "pointer-events-none absolute -inset-px rounded-lg"
                                    )}
                                    aria-hidden="true"
                                  />
                                </>
                              )}
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup> */}
                    </div>
                    <div className="flex gap-[15px] justify-end mt-8">
                      <div>
                        <button
                          onClick={() => setStep(1)}
                          className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] no-underline active:scale-95 scale-100 duration-75"
                          style={{
                            boxShadow: "0 1px 1px #0c192714, 0 1px 3px #0c192724",
                          }}
                        >
                          Previous step
                        </button>
                      </div>
                      <div>
                        <button
                          // onClick={() => {
                          //   setStep(3);
                          // }}
                          type="submit"
                          className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
                          style={{
                            boxShadow:
                              "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <span> Submit </span>
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.75 6.75L19.25 12L13.75 17.25"
                              stroke="#FFF"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M19 12H4.75"
                              stroke="#FFF"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </form>
                </Form>
              </motion.div>
            ) : step === 3 ? (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                key="step-2"
                transition={{
                  duration: 0.95,
                  ease: [0.165, 0.84, 0.44, 1],
                }}
                className="max-w-lg mx-auto px-4 lg:px-0"
              >
                    <h2 className="text-4xl font-bold text-[#1E2B3A]">
                      Your Home Estimate
                    </h2>
                    <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                      Here is an AI predicted home estimate based off your property information.
                    </p>
                    <div className="space-y-4">

                    </div>
                    <div className="flex gap-[15px] justify-end mt-8">
                      <div>
                        <button
                          onClick={() => setStep(2)}
                          className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] no-underline active:scale-95 scale-100 duration-75"
                          style={{
                            boxShadow: "0 1px 1px #0c192714, 0 1px 3px #0c192724",
                          }}
                        >
                          Previous step
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            setStep(4);
                          }}
                          // type="submit"
                          className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
                          style={{
                            boxShadow:
                              "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <span> I want more! </span>
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.75 6.75L19.25 12L13.75 17.25"
                              stroke="#FFF"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M19 12H4.75"
                              stroke="#FFF"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                key="step-2"
                transition={{
                  duration: 0.95,
                  ease: [0.165, 0.84, 0.44, 1],
                }}
                className="max-w-lg mx-auto px-4 lg:px-0"
              >
                <Form {...contactForm}>
                  <form
                    onSubmit={contactForm.handleSubmit((e) => setStep(4))}
                    className="space-y-4"
                  >
                    <h2 className="text-4xl font-bold text-[#1E2B3A]">
                      Contact Info
                    </h2>
                    <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                      Add your contact info to get an in-depth property estimation report from one of our agents.
                    </p>
                    <div className="space-y-4">
                      <FormField
                        control={contactForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="space-y-1 w-full">
                            <Label>First Name<span className="text-red-500">*</span></Label>
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
                            <Label>Last Name<span className="text-red-500">*</span></Label>
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
                            <Label>Email<span className="text-red-500">*</span></Label>
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
                            <Label>Phone<span className="text-red-500">*</span></Label>
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
                    </div>
                    <div className="flex gap-[15px] justify-end mt-8">
                      <div>
                        <button
                          onClick={() => setStep(3)}
                          className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] no-underline active:scale-95 scale-100 duration-75"
                          style={{
                            boxShadow: "0 1px 1px #0c192714, 0 1px 3px #0c192724",
                          }}
                        >
                          Back to predictions
                        </button>
                      </div>
                      <div>
                        <button
                          // onClick={() => {
                          //   setStep(3);
                          // }}
                          type="submit"
                          className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
                          style={{
                            boxShadow:
                              "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <span> Submit </span>
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.75 6.75L19.25 12L13.75 17.25"
                              stroke="#FFF"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M19 12H4.75"
                              stroke="#FFF"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </form>
                </Form>
              </motion.div>
            )}
          </div>
        </div>
        <div className="w-full h-[40vh] md:w-1/2 md:h-screen bg-[#F1F2F4] relative overflow-hidden">
          <svg
            id="texture"
            style={{ filter: "contrast(120%) brightness(120%)" }}
            className="fixed z-[1] w-full h-full opacity-[35%]"
          >
            <filter id="noise" data-v-1d260e0e="">
              <feTurbulence
                type="fractalNoise"
                baseFrequency=".8"
                numOctaves="4"
                stitchTiles="stitch"
                data-v-1d260e0e=""
              ></feTurbulence>
              <feColorMatrix
                type="saturate"
                values="0"
                data-v-1d260e0e=""
              ></feColorMatrix>
            </filter>
            <rect
              width="100%"
              height="100%"
              filter="url(#noise)"
              data-v-1d260e0e=""
            ></rect>
          </svg>
          <div id="map-container" style={{ height: '100%', position: 'absolute', width: '100%' }}>
            <div id="map" style={{ height: '100%', position: 'absolute', width: '100%' }} />
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
