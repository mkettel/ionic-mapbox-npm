export interface MapboxPluginPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
