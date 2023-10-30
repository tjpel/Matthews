'use client';

import Radar from 'radar-sdk-js';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { AnimatePresence, motion } from 'framer-motion';
import { RadioGroup } from '@headlessui/react';
import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from 'react';
import { set, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { useQuery } from '@tanstack/react-query';
import { bridge } from '@/lib/bridge';
import axios, { AxiosResponse } from 'axios';
import { Separator } from '@/components/ui/separator';
import { getDistance, isPointWithinRadius } from 'geolib';
import * as turf from '@turf/turf';
import { ScrollArea } from '@/components/ui/scroll-area';
import { addressSchema, contactSchema, propertySchema } from '@/schemas/schema';
import * as gtag from '@/lib/gtag';
import { NumberBar } from '@/components/number-bar';
import { Loader } from '@mantine/core';
import { ContactForm } from '@/components/contact-form';

const questions = [
  {
    id: 1,
    name: '1 Bedroom',
    description: 'Single bedroom properties',
    difficulty: 1
  },
  {
    id: 2,
    name: '2 Bedrooms',
    description: 'Two-bedroom properties',
    difficulty: 2
  },
  {
    id: 3,
    name: '3 Bedrooms',
    description: 'Three-bedroom properties',
    difficulty: 3
  },
  {
    id: 4,
    name: '4+ Bedrooms',
    description: 'Four or more bedroom properties',
    difficulty: 4
  }
];

const Bedrooms = [
  {
    id: '1',
    name: '1 Bedrooms',
    // description: "Software Engineering",
    level: 'L1'
  },
  {
    id: '2',
    name: '2 Bedrooms',
    // description: "Software Engineering",
    level: 'L2'
  },
  {
    id: '3',
    name: '3 Bedrooms',
    // description: "Software Engineering",
    level: 'L3'
  },
  {
    id: '4',
    name: '4+ Bedrooms',
    // description: "Software Engineering",
    level: 'L4'
  }
];

const Bathrooms = [
  {
    id: '1',
    name: '1 Bathrooms',
    // description: "Software Engineering",
    level: 'L1'
  },
  {
    id: '2',
    name: '2 Bathrooms',
    // description: "Software Engineering",
    level: 'L1'
  },
  {
    id: '3',
    name: '3 Bathrooms',
    // description: "Software Engineering",
    level: 'L1'
  },
  {
    id: '4',
    name: '4+ Bathrooms',
    // description: "Software Engineering",
    level: 'L4'
  }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function DemoPage() {
  const [selected, setSelected] = useState<{
    id: number;
    name: string;
    description: string;
    difficulty: number;
  }>(questions[0]);
  const [selectedBathroom, setSelectedBathroom] = useState(Bathrooms[0]); // No type specified as per your request
  const [selectedBedroom, setSelectedBedroom] = useState(Bedrooms[0]); // No type specified as per your request
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<RadarAutocompleteAddress[]>(
    []
  );
  const [addressSuggestionsOpen, setAddressSuggestionsOpen] =
    useState<boolean>(false);
  const [map, setMap] = useState<any>();
  const searchCoordinates = {
    latitude: 34.05895086651929,
    longitude: -118.26037247571433
  };
  const distanceThreshold = 150; // distance in meters away from searchCoordinates where addresses are considered still good. Any address farther than distanceThreshold is considered bad for ML and will be flagged in UI
  const [isBadAddress, setIsBadAddress] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<{
    lowPrediction: string;
    prediction: string;
    numberPrediction: number; // To use in calculations + slider
    highPrediction: string;
  }>({
    lowPrediction: '0',
    prediction: '0',
    numberPrediction: 0,
    highPrediction: '0'
  });

  useEffect(() => {
    Radar.initialize('prj_live_pk_b172f4472789be4d6feee1895fd8d1f4ff69e531');
    setIsDesktop(window.innerWidth >= 768);

    const map = new (Radar.ui.map as any)({
      container: 'map',
      style: 'radar-default-v1',
      center: [-118.26037247571433, 34.05895086651929], // LA coordinates
      zoom: 8
    });

    setMap(map);

    // Cleanup function to run when the component unmounts
    return () => {
      map.remove(); // Remove the map to prevent memory leaks
    };
  }, []);

  const handleAutocomplete = async (incompleteAddress: string) => {
    try {
      console.log(incompleteAddress);

      const result = await Radar.autocomplete({
        query: incompleteAddress,
        near: searchCoordinates,
        // near: { latitude: 37.8272, longitude: -122.2913 },
        layers: ['address'],
        limit: 5,
        countryCode: 'US'
      });

      const { addresses } = result;
      console.log(addresses);
      setSuggestions(addresses);
    } catch (err) {
      console.error(err);
      // handle error
    }
  };

  const addressForm = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: {}
    }
  });

  const propertyForm = useForm<z.infer<typeof propertySchema>>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      //for model, sum all below to be 'Number of Units' -- Taylor will want unit mix even though model doesn't
    }
  });

  const watchedAddressForm = addressForm.watch();
  const watchedPropertyForm = propertyForm.watch();

  const getAddressData = async (address: string): Promise<any> => {
    gtag.search(address);
    await bridge.getPropertyData({ address });
  };

  const { isLoading, error } = useQuery(
    [
      'addressData',
      {
        latitude: watchedAddressForm.address?.latitude,
        longitude: watchedAddressForm.address?.longitude
      }
    ],
    async () => {
      console.log(watchedAddressForm.address.formattedAddress);
      return getAddressData(watchedAddressForm.address.formattedAddress);
    },
    {
      enabled:
        !!watchedAddressForm.address.latitude &&
        !!watchedAddressForm.address.longitude,
      onSuccess: (data) => {
        console.log('query success');
        console.log(propertyForm.getValues());
      },
      retry: false
    }
  );

  // TODO: Add predictionQuery type
  const predictionQuery = useQuery<any>(
    [
      'prediction',
      {
        latitude: watchedAddressForm.address?.latitude,
        longitude: watchedAddressForm.address?.longitude
      },
      { property: watchedPropertyForm }
    ],
    async () => {
      console.log('querying');
      console.log(watchedAddressForm.address);
      console.log(watchedPropertyForm);
      const propertyData = watchedPropertyForm;
      Object.assign(propertyData, {
        typicalFloorSF: propertyData.buildingSF,
        size: propertyData.buildingSF
      });

      // Await the axios.post call and then access the data property
      const response = await axios.post('/api/property/predict', {
        address: watchedAddressForm.address,
        user_inputs: propertyData
      });
      return response.data;
      // return await bridge.getPrediction({ address: watchedAddressForm.address, user_inputs: propertyData })
    },
    {
      enabled:
        !!addressForm.formState.isValid && !!propertyForm.formState.isValid,
      onSuccess: (data) => {
        console.log('query success');
        console.log(data);
        // Round to the nearest tens place
        const roundToTens = (num: number) => Math.round(num / 10) * 10;

        const lowPrediction = roundToTens(
          data.prediction - data.prediction * 0.1
        );
        const highPrediction = roundToTens(
          data.prediction + data.prediction * 0.1
        );
        const roundedPrediction = roundToTens(data.prediction);

        setPrediction({
          lowPrediction: lowPrediction.toLocaleString(),
          prediction: roundedPrediction.toLocaleString(),
          numberPrediction: roundedPrediction,
          highPrediction: highPrediction.toLocaleString()
        });
      },
      retry: false
    }
  );

  console.log(predictionQuery.isLoading);

  useEffect(() => {
    const addressFormValues = addressForm.getValues();

    console.log(addressFormValues);

    if (
      addressFormValues.address.latitude &&
      addressFormValues.address.longitude
    ) {
      const newCoords: [number, number] = [
        addressFormValues.address.longitude,
        addressFormValues.address.latitude
      ];

      const marker = Radar.ui
        .marker({ text: 'Property' })
        .setLngLat(newCoords)
        .addTo(map);

      map.flyTo({
        center: newCoords,
        zoom: 15
      });

      console.log('done');
    }
  }, [addressForm, watchedAddressForm, map]);

  const [scrollAreaActive, setScrollAreaActive] = useState<boolean>(true);
  // Custom Google Analytics information, ScrollArea refreshes position on step 3
  useEffect(() => {
    gtag.valuationStep(step);
    if (step === 3) {
      setScrollAreaActive(false);

      setTimeout(() => {
        setScrollAreaActive(true);
      }, 50);
    }
  }, [step]);

  return (
    <AnimatePresence>
      <div className="flex flex-col md:flex-row w-full md:overflow-hidden">
        <div className="w-full min-h-[60vh] md:w-1/2 md:h-screen flex flex-col px-4 pt-2 pb-8 md:px-0 md:py-2 bg-[#FCFCFC] justify-center">
          {scrollAreaActive && (
            <ScrollArea className="w-full rounded">
              <div className="h-full w-full items-center justify-center flex flex-col py-16">
                {step === 1 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    key="step-1"
                    transition={{
                      duration: 0.95,
                      ease: [0.165, 0.84, 0.44, 1]
                    }}
                    className="max-w-lg mx-auto px-4 lg:px-0"
                  >
                    <Form {...addressForm}>
                      <form
                        onSubmit={addressForm.handleSubmit((e) => setStep(2))}
                        className="space-y-4"
                      >
                        <h2 className="text-4xl font-bold text-[#1E2B3A]">
                          Find out what your multifamily property is really
                          worth
                        </h2>
                        <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                          Enter an address, and our AI will do the rest.
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
                                      placeholder="Enter your address"
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
                                          handleAutocomplete(
                                            field.value.formattedAddress
                                          );
                                          setAddressSuggestionsOpen(true);
                                        } else {
                                          setSuggestions([]);
                                        }
                                      }}
                                    />
                                    {addressSuggestionsOpen && (
                                      <div
                                        style={{
                                          position: 'absolute',
                                          zIndex: 1,
                                          backgroundColor: '#FFFFFF'
                                        }}
                                        className="z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                                      >
                                        <Command className="w-full p-0">
                                          <CommandEmpty>
                                            No address found.
                                          </CommandEmpty>
                                          <CommandGroup>
                                            {suggestions.map((suggestion) => (
                                              <CommandItem
                                                className="h-10 rounded-md"
                                                key={
                                                  suggestion.formattedAddress
                                                }
                                                onSelect={() => {
                                                  field.onChange(suggestion);
                                                  setAddressSuggestionsOpen(
                                                    false
                                                  );

                                                  console.log(
                                                    searchCoordinates
                                                  );
                                                  console.log(suggestion);

                                                  const turfSearchCoordinates =
                                                    turf.point([
                                                      searchCoordinates.latitude,
                                                      searchCoordinates.longitude
                                                    ]);
                                                  const turfTargetCoordinates =
                                                    turf.point([
                                                      suggestion.latitude,
                                                      suggestion.longitude
                                                    ]);

                                                  const distance =
                                                    turf.distance(
                                                      turfSearchCoordinates,
                                                      turfTargetCoordinates
                                                    );

                                                  console.log(distance);

                                                  if (
                                                    distance <=
                                                    distanceThreshold
                                                  ) {
                                                    console.log('good address');
                                                    setIsBadAddress(false);
                                                  } else {
                                                    console.log('bad address');
                                                    setIsBadAddress(true);
                                                  }
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
                          {isBadAddress && (
                            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
                              Address is too far from the search coordinates,
                              beware bad prediction results
                            </div>
                          )}
                        </div>
                        <div className="flex gap-[15px] justify-end mt-8">
                          <div>
                            <Link
                              href="/"
                              className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] no-underline active:scale-95 scale-100 duration-75"
                              style={{
                                boxShadow:
                                  '0 1px 1px #0c192714, 0 1px 3px #0c192724'
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
                                  '0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)'
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
                      ease: [0.165, 0.84, 0.44, 1]
                    }}
                    className="max-w-lg mx-auto px-4 lg:px-0"
                  >
                    <Form {...propertyForm}>
                      <form
                        onSubmit={propertyForm.handleSubmit((e) => setStep(3))}
                        className="space-y-4"
                      >
                        <h2 className="text-4xl font-bold text-[#1E2B3A]">
                          Multifamily Information
                        </h2>
                        <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                          Add your property information so we can provide you
                          with an accurate property estimation report. If
                          parameter is not applicable, enter 0.
                        </p>
                        <div className="space-y-4 px-4">
                          <FormField
                            control={propertyForm.control}
                            name="netIncome"
                            render={({ field }) => (
                              <FormItem className="space-y-1 w-full">
                                <Label>$ Net Income</Label>
                                <FormControl>
                                  <Input
                                    className="h-14"
                                    placeholder="If none, enter 0. If unknown, enter an estimate."
                                    type="number"
                                    value={field.value}
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* New FormField for buildingSF */}
                          <FormField
                            control={propertyForm.control}
                            name="buildingSF"
                            render={({ field }) => (
                              <FormItem className="space-y-1 w-full">
                                <Label>Building Size (sq ft)</Label>
                                <FormControl>
                                  <Input
                                    className="h-14"
                                    placeholder="If none, enter 0. If unknown, enter an estimate."
                                    type="number"
                                    value={field.value}
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* FormField for numberOfParkingSpaces */}
                          <FormField
                            control={propertyForm.control}
                            name="numberOfParkingSpaces"
                            render={({ field }) => (
                              <FormItem className="space-y-1 w-full">
                                <Label>Number of Parking Spaces</Label>
                                <FormControl>
                                  <Input
                                    className="h-14"
                                    placeholder="If none, enter 0. If unknown, enter an estimate."
                                    type="text" // Change this to text to allow formatted numbers
                                    value={
                                      field.value !== undefined &&
                                      field.value !== null
                                        ? field.value
                                            .toString()
                                            .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ','
                                            )
                                        : ''
                                    }
                                    onChange={(e) => {
                                      // Only proceed if the input is empty or contains digits possibly separated by commas
                                      if (
                                        e.target.value === '' ||
                                        /^[0-9,]+$/.test(e.target.value)
                                      ) {
                                        // Remove commas and parse the value as a float
                                        const actualValue = parseFloat(
                                          e.target.value.replace(/,/g, '')
                                        );

                                        if (!isNaN(actualValue)) {
                                          // If it's a valid number, update the state
                                          field.onChange(actualValue);
                                        } else {
                                          // If it's not a valid number (e.g., empty string), set to undefined or some default value
                                          field.onChange(undefined);
                                        }
                                      }
                                      // If the input contains anything other than numbers and commas, ignore the change
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* FormField for numberOfStudiosUnits */}
                          <FormField
                            control={propertyForm.control}
                            name="numberOfStudiosUnits"
                            render={({ field }) => (
                              <FormItem className="space-y-1 w-full">
                                <Label>Number of Studio Units</Label>
                                <FormControl>
                                  <Input
                                    className="h-14"
                                    placeholder="If none, enter 0. If unknown, enter an estimate."
                                    type="text" // Change this to text to allow formatted numbers
                                    value={
                                      field.value !== undefined &&
                                      field.value !== null
                                        ? field.value
                                            .toString()
                                            .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ','
                                            )
                                        : ''
                                    }
                                    onChange={(e) => {
                                      // Only proceed if the input is empty or contains digits possibly separated by commas
                                      if (
                                        e.target.value === '' ||
                                        /^[0-9,]+$/.test(e.target.value)
                                      ) {
                                        // Remove commas and parse the value as a float
                                        const actualValue = parseFloat(
                                          e.target.value.replace(/,/g, '')
                                        );

                                        if (!isNaN(actualValue)) {
                                          // If it's a valid number, update the state
                                          field.onChange(actualValue);
                                        } else {
                                          // If it's not a valid number (e.g., empty string), set to undefined or some default value
                                          field.onChange(undefined);
                                        }
                                      }
                                      // If the input contains anything other than numbers and commas, ignore the change
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* FormField for numberOf1BedroomsUnits */}
                          <FormField
                            control={propertyForm.control}
                            name="numberOf1BedroomsUnits"
                            render={({ field }) => (
                              <FormItem className="space-y-1 w-full">
                                <Label>Number of 1 Bedroom Units</Label>
                                <FormControl>
                                  <Input
                                    className="h-14"
                                    placeholder="If none, enter 0. If unknown, enter an estimate."
                                    type="text" // Change this to text to allow formatted numbers
                                    value={
                                      field.value !== undefined &&
                                      field.value !== null
                                        ? field.value
                                            .toString()
                                            .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ','
                                            )
                                        : ''
                                    }
                                    onChange={(e) => {
                                      // Only proceed if the input is empty or contains digits possibly separated by commas
                                      if (
                                        e.target.value === '' ||
                                        /^[0-9,]+$/.test(e.target.value)
                                      ) {
                                        // Remove commas and parse the value as a float
                                        const actualValue = parseFloat(
                                          e.target.value.replace(/,/g, '')
                                        );

                                        if (!isNaN(actualValue)) {
                                          // If it's a valid number, update the state
                                          field.onChange(actualValue);
                                        } else {
                                          // If it's not a valid number (e.g., empty string), set to undefined or some default value
                                          field.onChange(undefined);
                                        }
                                      }
                                      // If the input contains anything other than numbers and commas, ignore the change
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* FormField for numberOf2BedroomsUnits */}
                          <FormField
                            control={propertyForm.control}
                            name="numberOf2BedroomsUnits"
                            render={({ field }) => (
                              <FormItem className="space-y-1 w-full">
                                <Label>Number of 2 Bedroom Units</Label>
                                <FormControl>
                                  <Input
                                    className="h-14"
                                    placeholder="If none, enter 0. If unknown, enter an estimate."
                                    type="text" // Change this to text to allow formatted numbers
                                    value={
                                      field.value !== undefined &&
                                      field.value !== null
                                        ? field.value
                                            .toString()
                                            .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ','
                                            )
                                        : ''
                                    }
                                    onChange={(e) => {
                                      // Only proceed if the input is empty or contains digits possibly separated by commas
                                      if (
                                        e.target.value === '' ||
                                        /^[0-9,]+$/.test(e.target.value)
                                      ) {
                                        // Remove commas and parse the value as a float
                                        const actualValue = parseFloat(
                                          e.target.value.replace(/,/g, '')
                                        );

                                        if (!isNaN(actualValue)) {
                                          // If it's a valid number, update the state
                                          field.onChange(actualValue);
                                        } else {
                                          // If it's not a valid number (e.g., empty string), set to undefined or some default value
                                          field.onChange(undefined);
                                        }
                                      }
                                      // If the input contains anything other than numbers and commas, ignore the change
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {/* FormField for numberOf3BedroomsUnits */}
                          <FormField
                            control={propertyForm.control}
                            name="numberOf3BedroomsUnits"
                            render={({ field }) => (
                              <FormItem className="space-y-1 w-full">
                                <Label>Number of 3 Bedroom Units</Label>
                                <FormControl>
                                  <Input
                                    className="h-14"
                                    placeholder="If none, enter 0. If unknown, enter an estimate."
                                    type="text" // Change this to text to allow formatted numbers
                                    value={
                                      field.value !== undefined &&
                                      field.value !== null
                                        ? field.value
                                            .toString()
                                            .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ','
                                            )
                                        : ''
                                    }
                                    onChange={(e) => {
                                      // Only proceed if the input is empty or contains digits possibly separated by commas
                                      if (
                                        e.target.value === '' ||
                                        /^[0-9,]+$/.test(e.target.value)
                                      ) {
                                        // Remove commas and parse the value as a float
                                        const actualValue = parseFloat(
                                          e.target.value.replace(/,/g, '')
                                        );

                                        if (!isNaN(actualValue)) {
                                          // If it's a valid number, update the state
                                          field.onChange(actualValue);
                                        } else {
                                          // If it's not a valid number (e.g., empty string), set to undefined or some default value
                                          field.onChange(undefined);
                                        }
                                      }
                                      // If the input contains anything other than numbers and commas, ignore the change
                                    }}
                                  />
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
                                boxShadow:
                                  '0 1px 1px #0c192714, 0 1px 3px #0c192724'
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
                                  '0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)'
                              }}
                            >
                              <span> Your home estimation </span>
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
                    key="step-3"
                    transition={{
                      duration: 0.95,
                      ease: [0.165, 0.84, 0.44, 1]
                    }}
                    className="max-w-lg mx-auto px-4 lg:px-0"
                  >
                    <h2 className="text-4xl font-bold text-[#1E2B3A]">
                      Your Multifamily Estimate
                    </h2>
                    <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                      Here is an AI predicted multifamily estimate based off
                      your property information.
                    </p>
                    <div className="space-y-4">
                      {predictionQuery.isLoading && (
                        <Loader color="blue" type="dots" />
                      )}

                      {!predictionQuery.isLoading && (
                        <RadioGroup value={prediction.prediction}>
                          <RadioGroup.Label className="sr-only">
                            Your Multifamily Estimate
                          </RadioGroup.Label>
                          <Label>Your Multifamily Estimate</Label>
                          <div className="space-y-4">
                            <RadioGroup.Option
                              key={prediction.prediction}
                              value={prediction.prediction}
                              className={({ checked, active }) =>
                                classNames(
                                  checked
                                    ? 'border-transparent'
                                    : 'border-gray-300',
                                  active
                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                    : '',
                                  'relative cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none flex justify-between'
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
                                        ${prediction.prediction}
                                      </RadioGroup.Label>
                                      <RadioGroup.Description
                                        as="span"
                                        className="text-gray-500"
                                      >
                                        <span className="block">
                                          {/* {prediction.prediction} */}
                                        </span>
                                      </RadioGroup.Description>
                                    </span>
                                  </span>
                                  <RadioGroup.Description
                                    as="span"
                                    className="flex text-sm ml-4 mt-0 flex-col text-right items-center justify-center"
                                  >
                                    <span className=" text-gray-500">
                                      {prediction.numberPrediction >= 0 &&
                                      prediction.numberPrediction < 500000 ? (
                                        <NumberBar level={1} totalBars={5} />
                                      ) : prediction.numberPrediction >=
                                          500000 &&
                                        prediction.numberPrediction <
                                          1500000 ? (
                                        <NumberBar level={2} totalBars={5} />
                                      ) : prediction.numberPrediction >=
                                        1500000 ? (
                                        <NumberBar level={3} totalBars={5} />
                                      ) : (
                                        <NumberBar level={4} totalBars={5} />
                                      )}
                                    </span>
                                    <span className="font-medium text-gray-900"></span>
                                  </RadioGroup.Description>
                                  <span
                                    className={classNames(
                                      active ? 'border' : 'border-2',
                                      checked
                                        ? 'border-blue-500'
                                        : 'border-transparent',
                                      'pointer-events-none absolute -inset-px rounded-lg'
                                    )}
                                    aria-hidden="true"
                                  />
                                </>
                              )}
                            </RadioGroup.Option>
                          </div>
                        </RadioGroup>
                      )}
                    </div>
                    <div className="mt-10 space-y-4">
                      <h2 className="text-4xl font-bold text-[#1E2B3A]">
                        Contact Us
                      </h2>
                      <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                        Add your contact info to get an in-depth property
                        estimation report from one of our agents.
                      </p>

                      <ContactForm />
                    </div>
                    <div className="flex gap-[15px] justify-end mt-8">
                      <div>
                        <button
                          onClick={() => setStep(2)}
                          className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] no-underline active:scale-95 scale-100 duration-75"
                          style={{
                            boxShadow:
                              '0 1px 1px #0c192714, 0 1px 3px #0c192724'
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
                          className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
                          style={{
                            boxShadow:
                              '0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          <span> Submit Contact Info </span>
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
                ) : step === 4 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    key="step-4"
                    transition={{
                      duration: 0.95,
                      ease: [0.165, 0.84, 0.44, 1]
                    }}
                    className="max-w-lg mx-auto px-4 lg:px-0"
                  >
                    <h2 className="text-4xl font-bold text-[#1E2B3A]">
                      Thank You for using MF Value!
                    </h2>
                    <p className="text-[14px] leading-[20px] text-[#1a2b3b] font-normal my-4">
                      An agent will be in contact with you very soon to discuss
                      your property.
                    </p>
                    <div className="flex gap-[15px] justify-end mt-8">
                      <button
                        onClick={() => setStep(1)}
                        className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#f5f7f9] text-[#1E2B3A] no-underline active:scale-95 scale-100 duration-75"
                        style={{
                          boxShadow: '0 1px 1px #0c192714, 0 1px 3px #0c192724'
                        }}
                      >
                        Estimate another property
                      </button>
                      <Link href="/" className="group">
                        <button
                          className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline active:scale-95 scale-100 duration-75"
                          style={{
                            boxShadow:
                              '0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          Back to Home
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <></>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
        <div className="w-full h-[40vh] md:w-1/2 md:h-screen bg-[#F1F2F4] relative overflow-hidden">
          <svg
            id="texture"
            style={{ filter: 'contrast(120%) brightness(120%)' }}
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
          <div
            id="map-container"
            style={{ height: '100%', position: 'absolute', width: '100%' }}
          >
            <div
              id="map"
              style={{ height: '100%', position: 'absolute', width: '100%' }}
            />
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
