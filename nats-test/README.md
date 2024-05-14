# node-nats-streaming demo

to run publisher: `pnpm run publish`

to run listener: `pnpm run listen`

### port forwarding for nats pod in k8s

run `kubectl port-forward <nats-pod-name> 4222:4222`

for monitoring, run `kubectl port-forward <nats-pod-name> 8222:8222`
