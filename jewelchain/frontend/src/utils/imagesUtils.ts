const mapImg: Record<string, string> = {
  Diamante: '/images/diamante.webp',
  Oro: '/images/oro.webp',
  Plata: '/images/plata.webp',
  Zafiro: '/images/zafiro.webp',
  Rubi: '/images/rubi.webp'
}


export const selectImgByName = (name: string): string => {
  const imgSrc: string | undefined = mapImg[name];

  return imgSrc === undefined ? '/images/default-jewel.webp' : imgSrc;
}