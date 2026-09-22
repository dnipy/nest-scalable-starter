export interface AlertNotifier {
  send(message: string): Promise<void>;
}
