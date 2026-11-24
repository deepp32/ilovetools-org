declare module 'gifshot' {
  const gifshot: any;
  export default gifshot;
}

declare module 'heic2any' {
  const heic2any: (options: any) => Promise<Blob | Blob[]>;
  export default heic2any;
}
