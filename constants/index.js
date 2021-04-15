export const UI_CONFIG = JSON.parse(process.env.uiconfig);
Object.freeze(UI_CONFIG);

export const LOGIN_STRATEGY = {
    metaMask: 'metamask',
    walletConnect: 'walletconnect',
    portis: 'portis',
};
