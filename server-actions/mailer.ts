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

export const sendReferralEmail = async (referrerEmail: string, referredEmail: string, referralCode?: string) => {
  const subject = `Your friend wants you to check out Next Voters`;

  const code = referralCode ? encodeURIComponent(referralCode) : encodeURIComponent(referrerEmail);
  const signupUrl = `https://nextvoters.com/request-region?ref=${code}`;
  const shareBaseUrl = `https://nextvoters.com/request-region?ref=${code}`;
  const shareText = encodeURIComponent("Stay informed about your local politics with free weekly reports from Next Voters");
  const encodedShareUrl = encodeURIComponent(shareBaseUrl);

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedShareUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`;

  const text = [
    "Hi,",
    "",
    `Your friend (${referrerEmail}) thinks you'd love Next Voters — a free, bias-free way to get weekly summaries about your local politics.`,
    "",
    `Sign up here: ${signupUrl}`,
    "",
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Next Voters Referral</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F5F0;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F5F5F0">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <!-- MAIN CONTAINER -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-collapse: collapse;">
          <!-- HEADER -->
          <tr>
            <td style="background-color: #E63946; padding: 0;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 30px 30px 20px 30px; text-align: center;">
                    <img src="https://nextvoters.com/logo/nextvoters-white.png" alt="Next Voters" width="72" style="display: block; margin: 0 auto; height: auto; border: 0;" />
                    <span style="font-family: 'DM Sans', Arial, sans-serif; font-size: 11px; color: #FFFFFF; letter-spacing: 6px; text-transform: uppercase; font-weight: 500; display: block; padding-top: 12px;">Next Voters</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ACCENT BORDER -->
          <tr>
            <td style="height: 6px; background-color: #E63946; border-bottom: 3px solid #1A1A1A;"></td>
          </tr>

          <!-- BODY CONTENT -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 40px 35px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-family: 'DM Sans', Arial, sans-serif; font-size: 22px; color: #1A1A1A; font-weight: 700; padding-bottom: 20px; text-align: center;">
                    You've been invited!
                  </td>
                </tr>
                <tr>
                  <td style="font-family: 'DM Sans', Arial, sans-serif; font-size: 15px; color: #333333; line-height: 1.7; padding-bottom: 15px;">
                    Your friend <strong>${escapeHtml(referrerEmail)}</strong> thinks you'd love <strong>Next Voters</strong> &mdash; a free, bias-free way to get weekly summaries about your local politics delivered straight to your inbox.
                  </td>
                </tr>
                <tr>
                  <td style="font-family: 'DM Sans', Arial, sans-serif; font-size: 15px; color: #333333; line-height: 1.7; padding-bottom: 30px;">
                    Sign up in 30 seconds and stay informed about the decisions that affect your community.
                  </td>
                </tr>
                <!-- CTA BUTTON -->
                <tr>
                  <td align="center" style="padding-bottom: 35px;">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="background-color: #E63946; border-radius: 8px;">
                          <a href="${signupUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; font-family: 'DM Sans', Arial, sans-serif; font-size: 16px; font-weight: 700; color: #FFFFFF; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">Sign Up Now</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SOCIAL SHARE SECTION -->
          <tr>
            <td style="background-color: #F8F8F5; padding: 25px 35px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 15px;">
                    <span style="font-family: 'DM Sans', Arial, sans-serif; font-size: 13px; color: #1A1A1A; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Share With Friends</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <!-- Twitter/X Button -->
                        <td align="center" style="padding: 0 6px;">
                          <a href="${twitterShareUrl}" target="_blank" style="display: inline-block; width: 40px; height: 40px; line-height: 40px; background-color: #1A1A1A; border-radius: 8px; text-align: center; text-decoration: none; font-family: 'DM Sans', Arial, sans-serif; font-size: 16px; font-weight: 700; color: #FFFFFF;">X</a>
                        </td>
                        <!-- Facebook Button -->
                        <td align="center" style="padding: 0 6px;">
                          <a href="${facebookShareUrl}" target="_blank" style="display: inline-block; width: 40px; height: 40px; line-height: 40px; background-color: #1877F2; border-radius: 8px; text-align: center; text-decoration: none; font-family: 'DM Sans', Arial, sans-serif; font-size: 16px; font-weight: 700; color: #FFFFFF;">f</a>
                        </td>
                        <!-- LinkedIn Button -->
                        <td align="center" style="padding: 0 6px;">
                          <a href="${linkedinShareUrl}" target="_blank" style="display: inline-block; width: 40px; height: 40px; line-height: 40px; background-color: #0A66C2; border-radius: 8px; text-align: center; text-decoration: none; font-family: 'DM Sans', Arial, sans-serif; font-size: 16px; font-weight: 700; color: #FFFFFF;">in</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <span style="font-family: 'DM Sans', Arial, sans-serif; font-size: 12px; color: #666666; line-height: 1.5;">Help your community stay informed</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #1A1A1A; padding: 30px 35px; text-align: center;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <img src="https://nextvoters.com/logo/nextvoters-white.png" alt="Next Voters" width="36" style="display: inline-block; height: auto; border: 0;" />
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 15px;">
                    <a href="https://nextvoters.org" style="font-family: 'DM Sans', Arial, sans-serif; font-size: 12px; color: #E63946; text-decoration: none; font-weight: 500; letter-spacing: 1px;">NEXTVOTERS.ORG</a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <span style="font-family: 'DM Sans', Arial, sans-serif; font-size: 11px; color: #888888; line-height: 1.6;">Empowering local democracy, one vote at a time.</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `NV Local <${process.env.EMAIL_USER}>`,
    to: referredEmail,
    subject,
    text,
    html,
  });
}

export const sendConfirmationEmail = async (email: string, preferredCategories: string[]) => {
  const lastFolder = await getLastSummaryFolder();
  
  const htmlAnchorElement = preferredCategories.map(category => {
    return `<a href="https://${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/next-voters-summaries/public/${lastFolder}/${category}.html">${category}</a>`;
  });

  const html = `
    <div>
      <p>Thank you for signing up to NV Local!</p>
      <p>As a bonus, here's the most recent summary:</p>
      <ul>
        ${preferredCategories.map(category => `<li>${category}</li>`).join("")}
      </ul>
    </div>
  `;

  await transporter.sendMail({
    from: `NV Local <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Confirmation Email",
    html,
  });
}