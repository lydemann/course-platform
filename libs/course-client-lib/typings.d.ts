/* SystemJS module definition */
declare let module: NodeModule;

interface NodeModule {
  id: string;
}

interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;
}
