import * as WebBrowser from 'expo-web-browser';

export function openLink(url: string) {
  return WebBrowser.openBrowserAsync(url, {
    toolbarColor: '#FCFBF8',
    controlsColor: '#B05637',
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.POPOVER,
  });
}
