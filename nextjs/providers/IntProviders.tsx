"use client";

import React from "react";
import { IntlProvider } from "react-intl";

export default function IntlProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <IntlProvider locale="id">{children}</IntlProvider>;
}
