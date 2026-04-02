import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export interface CurrencyInfo {
    code: string;
    symbol: string;
    name: string;
    rate: number; // multiplier from IDR
    locale: string;
}

export const CURRENCIES: CurrencyInfo[] = [
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', rate: 1, locale: 'id-ID' },
    { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.000062, locale: 'en-US' },
    { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.000057, locale: 'de-DE' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 0.000082, locale: 'en-SG' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 0.00044, locale: 'zh-CN' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 0.0093, locale: 'ja-JP' },
    { code: 'WON', symbol: '₩', name: 'Korean Won', rate: 0.083, locale: 'ko-KR' },
];

// Map language code to default currency code
export const LANG_TO_CURRENCY: Record<string, string> = {
    id: 'IDR',
    en: 'USD',
    zh: 'CNY',
    de: 'EUR',
    ja: 'JPY',
    ko: 'WON',
    fr: 'EUR',
};

interface CurrencyContextValue {
    currency: CurrencyInfo;
    setCurrencyCode: (code: string) => void;
    setCurrencyFromLanguage: (langCode: string) => void;
    formatPrice: (amountIDR: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
    currency: CURRENCIES[0],
    setCurrencyCode: () => {},
    setCurrencyFromLanguage: () => {},
    formatPrice: (n) => `Rp ${n.toLocaleString('id-ID')}`,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const { i18n } = useTranslation();
    const [currencyCode, setCurrencyCodeState] = useState<string>('IDR');

    // Sync initial currency from current language on mount
    useEffect(() => {
        const lang = i18n.language?.split('-')[0] || 'id';
        const defaultCurrency = LANG_TO_CURRENCY[lang] || 'IDR';
        setCurrencyCodeState(defaultCurrency);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];

    const setCurrencyCode = useCallback((code: string) => {
        setCurrencyCodeState(code);
    }, []);

    // Called when language changes — auto-updates currency, does NOT change language
    const setCurrencyFromLanguage = useCallback((langCode: string) => {
        const lang = langCode.split('-')[0];
        const defaultCurrency = LANG_TO_CURRENCY[lang] || 'IDR';
        setCurrencyCodeState(defaultCurrency);
    }, []);

    const formatPrice = useCallback((amountIDR: number): string => {
        const converted = amountIDR * currency.rate;
        if (currency.code === 'IDR') {
            // Format as Rp 25.000.000
            return `${currency.symbol} ${Math.round(converted).toLocaleString('id-ID')}`;
        }
        // For other currencies, show 0 decimal places for large amounts
        const formatted = converted < 100
            ? converted.toFixed(2)
            : Math.round(converted).toLocaleString(currency.locale);
        return `${currency.symbol}${formatted}`;
    }, [currency]);

    return (
        <CurrencyContext.Provider value={{ currency, setCurrencyCode, setCurrencyFromLanguage, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    return useContext(CurrencyContext);
}
