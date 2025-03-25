// Mock implementations of Pipecat libraries for development
export const mockPipecatClient = {
  connect: async () => {
    console.log('Mocked Pipecat client connected');
    return {
      session: {
        id: 'mock-session-id',
        startTime: new Date(),
      },
      disconnect: () => console.log('Mocked Pipecat client disconnected'),
    };
  },
};

export const mockPipecatReact = {
  usePipecat: () => ({
    isConnected: true,
    isConnecting: false,
    client: mockPipecatClient,
    error: null,
  }),
};
