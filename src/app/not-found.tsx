import { NextIntlClientProvider } from "next-intl";
import NotFoundClient from "@/components/NotFoundClient";

const NotFoundPage = () => {
  return (
    <NextIntlClientProvider>
      <NotFoundClient />
    </NextIntlClientProvider>
  );
};

export default NotFoundPage;
