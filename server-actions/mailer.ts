"use server";

import { transporter } from "@/lib/nodemailer";
import { getLastSummaryFolder } from "@/lib/supabase-helper";

const escapeHtml = (input: string): string => {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const sendReferralEmail = async (referrerEmail: string, referredEmail: string) => {
  const subject = `Your friend (${referrerEmail}) wants you to check this out`;

  const signupUrl = "https://nextvoters.com/civic-line";

  const text = [
    "Hi,",
    "",
    `Your friend with the email ${referrerEmail} is referring you to sign up for the Next Voters Line, a free, bias-free way to get emailed weekly summaries of the NYC politics you care about.`,
    "",
    "No pressure, but you can sign up here for a week in 30 seconds to see what the hype is about.",
    "",
    signupUrl,
    "",
  ].join("\n");

  const html = `
    <p>Hi,</p>
    <p>
      Your friend with the email <strong>${escapeHtml(referrerEmail)}</strong> is referring you to sign up for the Next Voters Line, a free, bias-free way to get emailed weekly summaries of the NYC politics you care about.
    </p>
    <p>
      No pressure, but you can sign up <a href="${signupUrl}">here</a> for a week in 30 seconds to see what the hype is about.
    </p>
  `;

  await transporter.sendMail({
    from: `Next Voters Line <${process.env.EMAIL_USER}>`,
    to: referredEmail,
    subject,
    text,
    html,
  });
}

export const sendConfirmationEmail = async (email: string, preferredCategories: string[]) => {
  const lastFolder = await getLastSummaryFolder();
  
  const htmlAnchorElement = preferredCategories.map(category => {
    return `<a href="https://storage.googleapis.com/${process.env.NEXT_PUBLIC_SUPABASE_URL}/public/next-voters-summaries/${lastFolder}/${category}.html">${category}</a>`;
  });

  const html = `
    <div>
      <p>Thank you for signing up to Next Voters Line!</p>
      <p>As a bonus, here's last week's summary:</p>
      <ul>
        ${htmlAnchorElement.join("")}
      </ul>
    </div>
  `;

  const html = `
    <div>
      <p>Thank you for signing up to Next Voters Line!</p>
      <p>As a bonus, here's the most recent summary:</p>
      <ul>
        ${preferredCategories.map(category => `<li>${category}</li>`).join("")}
      </ul>
    </div>
  `;

  await transporter.sendMail({
    from: `Next Voters Line <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Confirmation Email",
    html,
  });
}