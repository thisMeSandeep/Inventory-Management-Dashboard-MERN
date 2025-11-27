export const getCookieOptions = (maxAge: number) => {
  const isProduction =
    process.env.NODE_ENV?.trim().toLowerCase() === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
    maxAge,
  };
};
