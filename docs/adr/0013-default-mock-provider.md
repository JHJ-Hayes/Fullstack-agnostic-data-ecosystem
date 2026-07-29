# Default mock provider stays for zero-config DX

When no Data Provider is injected, FAE uses the built-in in-memory mock User provider so frontend adapters work out of the box. Docs must label this as simulation; production uses an injected Database Adapter provider.
