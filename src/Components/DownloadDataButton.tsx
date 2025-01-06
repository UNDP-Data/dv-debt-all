import { FileDown } from 'lucide-react';

interface Props {
  link: string;
}
export function DownloadDataButton(props: Props) {
  const { link } = props;
  return (
    <a
      className='undp-button'
      style={{
        backgroundColor: '#f7f7f7',
        padding: '0.5rem',
        border: '1px solid #EDEFF0',
      }}
      href={link}
      target='_blank'
      rel='noreferrer'
      title='Download data'
    >
      <FileDown size={20} stroke='#000000' strokeWidth={1.2} />
    </a>
  );
}
