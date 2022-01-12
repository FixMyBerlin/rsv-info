import React from 'react';
import { Footer, Navigation } from '.';
import Helmet from 'react-helmet';
import classNames from 'classnames';

type Props = {
  className?: string;
  location?: any; // TODO: define type
  navigation?: boolean;
};

// TODO: Maybe we need to prevent the layout from unmounting, see https://www.gatsbyjs.com/docs/how-to/routing/layout-components/#how-to-prevent-layout-components-from-unmounting
export const Layout: React.FC<Props> = ({
  className = '',
  navigation = true,
  location,
  children,
}) => {
  return (
    <>
      <Helmet
        htmlAttributes={{
          class: 'h-full',
        }}
        bodyAttributes={{
          class: 'h-full',
        }}
      />
      <div className="h-full flex flex-col">
        {navigation && <Navigation location={location} />}
        <main
          className={classNames(
            className,
            'p-5 pt-14 bg-green-50 flex-grow shadow-md shadow-green-900/20 z-0'
          )}
        >
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};