import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { navigate } from 'astro:transitions/client'
import { clsx } from 'clsx'

import { Fragment } from 'react'
import type { FederalStateFilterOption } from 'src/lib/steckbrief/getSteckbriefTeasers'

type Props = {
  currentFilter: string
  federalStateOptions: FederalStateFilterOption[]
}

/** @desc A list of all federal states including the number of RSVs */
export const SteckbriefePageFilter: React.FC<Props> = ({ currentFilter, federalStateOptions }) => {
  const statePaths = Object.fromEntries(
    federalStateOptions.map((option) => [option.state, option.path]),
  )

  return (
    <div className="mb-10 w-72">
      <Listbox value={currentFilter} onChange={(selected) => navigate(statePaths[selected])}>
        {({ open }) => (
          <>
            <Label className="block text-sm font-medium text-white">Filtern nach Bundesland</Label>
            <div className="relative mt-1">
              <ListboxButton className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pr-10 pl-3 text-left shadow-xs focus:border-slate-700 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden sm:text-sm">
                <span className="block truncate">{currentFilter}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </ListboxButton>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions className="ring-opacity-5 absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-xl ring-1 ring-black focus:outline-hidden sm:text-sm">
                  {federalStateOptions.map((option) => (
                    <ListboxOption
                      key={option.state}
                      className={
                        'relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none hover:bg-slate-700 hover:text-white'
                      }
                      value={option.state}
                    >
                      {({ selected }) => (
                        <div
                          className={clsx(
                            selected ? 'font-semibold' : 'font-normal',
                            'block truncate',
                          )}
                        >
                          {option.state} ({option.count})
                        </div>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  )
}
