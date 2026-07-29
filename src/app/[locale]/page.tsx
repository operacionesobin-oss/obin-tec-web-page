import { getDictionary, isLocale, defaultLocale } from '@/lib/i18n';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Testimonial from '@/components/Testimonial';
import CTABand from '@/components/CTABand';

export default function Home({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <Services locale={locale} dict={dict} />
      <Process locale={locale} dict={dict} />
      <Testimonial locale={locale} dict={dict} />
      <CTABand locale={locale} dict={dict} />
    </>
  );
}
