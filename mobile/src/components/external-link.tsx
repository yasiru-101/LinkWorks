/**
 * LinkWorks In-App External Browser Link Component
 * 
 * Owned by: Bhashitha (Design system & UI components)
 * 
 * Securely opens external documentation, policies, or third-party links inside an in-app browser sheet
 * on iOS and Android, preserving native navigation stack and app state.
 */

import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

// Anchor link component rendering in-app browser modals on native mobile and target="_blank" on web
export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}
