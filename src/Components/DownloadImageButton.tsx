import { ImageDown } from 'lucide-react';
import { imageDownload } from './ImageDownload';

interface Props {
  element?: HTMLDivElement;
  filename?: string;
}
export function DownloadImageButton(props: Props) {
  const { element, filename } = props;
  return (
    <button
      type='button'
      className='undp-button'
      title='Download graph as image'
      style={{
        backgroundColor: 'var(--gray-300)',
        padding: '0.625rem',
        border: '1px solid var(--gray-400)',
      }}
      onClick={() => {
        if (element) {
          imageDownload(element as HTMLElement, filename || 'image');
        } else {
          // eslint-disable-next-line no-console
          console.error('Cannot find the html element');
        }
      }}
    >
      <ImageDown size={24} stroke='var(--gray-700)' strokeWidth={1.5} />
    </button>
  );
}
