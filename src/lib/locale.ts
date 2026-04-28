import { getLocale } from "next-intl/server";

const isRtlLocale = (locale: string) => {
    return locale === 'ar';
}


export const getAppLocale = async () => {
    const locale = await getLocale();

    return {
        locale,
        isRtl: isRtlLocale(locale),
    };
}

