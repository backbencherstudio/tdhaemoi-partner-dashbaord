'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState, useRef } from 'react';

declare global {
    interface Window {
        google: {
            translate: {
                TranslateElement: new (
                    config: {
                        pageLanguage: string;
                        includedLanguages: string;
                        autoDisplay: boolean;
                    }
                ) => void;
            };
        };
    }
}

interface LanguageSwitcherProps {
    variant?: 'default' | 'minimal';
    className?: string;
    onLanguageChange?: (lang: string) => void;
}

const LanguageSwitcher = ({ variant = 'default', className = '', onLanguageChange }: LanguageSwitcherProps) => {
    const [languageDropDown, setLanguageDropDown] = useState(false);
    const [language, setLanguage] = useState("DE");
    const languageDropdownRef = useRef(null);
    const { selectedLang, setSelectedLang } = useLanguage();

    const handleDropdownToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLanguageDropDown(!languageDropDown);
    };

    const handleLanguageChange = (lang: string) => {
        const languageMap = {
            'English': { code: 'en', short: 'EN' },
            'German': { code: 'de', short: 'DE' },
            'Arabic': { code: 'ar', short: 'AR' },
            'Chinese': { code: 'zh-CN', short: 'ZH' },
            'French': { code: 'fr', short: 'FR' }
        };

        const langInfo = languageMap[lang as keyof typeof languageMap];

        if (langInfo) {
            const waitForGoogleTranslate = setInterval(() => {
                const selectElement = document.querySelector('.goog-te-combo');
                if (selectElement) {
                    clearInterval(waitForGoogleTranslate);
                    (selectElement as HTMLSelectElement).value = langInfo.code;
                    (selectElement as HTMLSelectElement).dispatchEvent(new Event('change'));

                    if (typeof window.google !== 'undefined' && window.google.translate) {
                        new window.google.translate.TranslateElement({
                            pageLanguage: 'de',
                            includedLanguages: 'en,de,ar,zh-CN,fr',
                            autoDisplay: false
                        });
                    }

                    setSelectedLang(langInfo.code);
                    setLanguage(langInfo.short);
                    setLanguageDropDown(false);
                    onLanguageChange?.(langInfo.code);
                }
            }, 100);

            setTimeout(() => clearInterval(waitForGoogleTranslate), 5000);
        }
    };

    useEffect(() => {
        const checkGoogleTranslate = () => {
            const element = document.querySelector('.goog-te-combo');
            if (element) {
                const currentLang = (element as HTMLSelectElement).value;
                setLanguage(
                    currentLang === 'ar' ? 'AR' :
                    currentLang === 'de' ? 'DE' :
                    currentLang === 'zh-CN' ? 'ZH' :
                    currentLang === 'fr' ? 'FR' : 'EN'
                );
            }
        };

        checkGoogleTranslate();
        const timeoutId = setTimeout(checkGoogleTranslate, 1000);
        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageDropdownRef.current && !(languageDropdownRef.current as HTMLElement).contains(event.target as Node)) {
                setLanguageDropDown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const dropdownStyles = variant === 'minimal' ? 'py-1 w-32' : 'py-2 w-full';
    const buttonStyles = variant === 'minimal' 
        ? 'px-3 py-1.5 text-sm rounded-md'
        : 'px-4 py-2 rounded-[8px] shadow-sm border border-gray-300 font-semibold';

    return (
        <div className={`flex items-center ${className}`}>
            <div className='relative inline-block text-left' ref={languageDropdownRef}>
                <button
                    className={`flex justify-between items-center w-full gap-x-1.5 bg-white text-gray-900 ${buttonStyles}`}
                    onClick={handleDropdownToggle}
                >
                    <div>{language}</div>
                    <svg
                        className={`size-5 text-[#475467] ${languageDropDown ? "rotate-180" : "rotate-0"} transform duration-300`}
                        viewBox='0 0 20 20'
                        fill='currentColor'
                    >
                        <path
                            fillRule='evenodd'
                            d='M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 011.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z'
                            clipRule='evenodd'
                        />
                    </svg>
                </button>

                {languageDropDown && (
                    <div className={`absolute z-50 right-0 mt-2 rounded-md bg-white shadow-lg ring-1 ring-black/5 ${dropdownStyles}`}>
                        <button
                            onClick={() => handleLanguageChange('German')}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 notranslate ${selectedLang === 'de' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                        >
                            German (DE)
                        </button>
                        <button
                            onClick={() => handleLanguageChange('English')}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 notranslate ${selectedLang === 'en' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                        >
                            English (EN)
                        </button>
                        <button
                            onClick={() => handleLanguageChange('Arabic')}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 notranslate ${selectedLang === 'ar' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                        >
                            Arabic (AR)
                        </button>
                        <button
                            onClick={() => handleLanguageChange('Chinese')}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 notranslate ${selectedLang === 'zh-CN' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                        >
                            Chinese (ZH)
                        </button>
                        <button
                            onClick={() => handleLanguageChange('French')}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 notranslate ${selectedLang === 'fr' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                        >
                            French (FR)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LanguageSwitcher;
