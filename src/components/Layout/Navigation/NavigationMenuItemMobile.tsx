import { Disclosure } from '@headlessui/react';
import classNames from 'classnames';
import { Link } from 'gatsby';
import React from 'react';

type Props = { currentPage: string; name: string; to: string };

export const NavigationMenuItemMobile: React.FC<Props> = ({
  currentPage,
  name,
  to,
}) => {
  const active = currentPage === to;

  // TODO: Find a way to use the Gatsby <Link to={to}> component here; or onClick={navigate(to)} so we take advantage of Gatsby's internal preloading.
  return (
    <Disclosure.Button
      as="a"
      href={`#${name}`}
      className={classNames(
        { 'bg-indigo-50 border-indigo-500 text-indigo-700': active },
        {
          'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700':
            !active,
        },
        'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
      )}
    >
      {name}
    </Disclosure.Button>
  );
};
