import domtoimage from 'dom-to-image';

export const imageDownload = (node: HTMLElement, filename: string) => {
  domtoimage
    .toPng(node, {
      style: {
        margin: 0,
      },
    })
    .then((dataUrl: string) => {
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    });
};
