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
        backgroundColor: '#f7f7f7',
        padding: '0.5rem',
        border: '1px solid #EDEFF0',
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
      <ImageDown size={20} stroke='#000000' strokeWidth={1.2} />
    </button>
  );
}
