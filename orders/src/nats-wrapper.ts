import nats, { Stan } from 'node-nats-streaming';

// Singleton NATS instance class
class NatsWrapper {
  private _client?: Stan;

  get client(): Stan {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  async connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => resolve());

      this.client.on('error', (err) => reject(err));
    });
  }
}

export const natsWrapper = new NatsWrapper();
