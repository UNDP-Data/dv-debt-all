import { Sheet } from 'lucide-react';

interface Props {
  link: string;
}
export function DownloadDataButton(props: Props) {
  const { link } = props;
  return (
    <a
      className='undp-button'
      style={{
        backgroundColor: 'var(--gray-300)',
        padding: '0.625rem',
        border: '1px solid var(--gray-400)',
      }}
      href={link}
      target='_blank'
      rel='noreferrer'
    >
      <Sheet size={24} stroke='var(--gray-700)' strokeWidth={1.5} />
    </a>
  );
}
