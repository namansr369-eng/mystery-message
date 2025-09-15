import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
  Container,
  Img
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  verifyCode: string;
}

const main = {
  backgroundColor: '#f6f9fc',
  padding: '20px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  borderRadius: '10px',
  padding: '40px',
  margin: '0 auto',
  maxWidth: '600px',
};

const codeContainer = {
  backgroundColor: '#F5F5F5',
  borderRadius: '5px',
  textAlign: 'center' as const,
  padding: '20px',
  fontSize: '32px',
  fontWeight: 'bold' as const,
  letterSpacing: '5px',
  color: '#4a4a4a',
  marginTop: '20px',
  marginBottom: '20px',
};

const button = {
  backgroundColor: '#007bff',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '5px',
  textDecoration: 'none',
  fontWeight: 'bold' as const,
};

const footerText = {
  textAlign: 'center' as const,
  color: '#888888',
  fontSize: '12px',
  marginTop: '20px',
};

export default function VerificationEmail({ username, verifyCode }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here's your verification code: {verifyCode}</Preview>
      <Section style={main}>
        <Container style={container}>
          {/* Optional: Add a logo or simple brand image here */}
          {/* <Img src="https://www.canva.com/create/logos/" alt="Your Brand Logo" style={{ marginBottom: '20px', display: 'block' }} /> */}

          <Heading as="h1" style={{ textAlign: 'center', color: '#333333' }}>
            Welcome, {username}!
          </Heading>
          
          <Text style={{ fontSize: '16px', lineHeight: '24px' }}>
            Thank you for registering. Please use the verification code below to complete your registration.
          </Text>

          <Row>
            <Section style={codeContainer}>
              <Text>{verifyCode}</Text>
            </Section>
          </Row>

          <Text style={{ fontSize: '14px', lineHeight: '20px', color: '#555555' }}>
            If you did not request this code, you can safely ignore this email.
          </Text>

          {/* Corrected and styled verify button */}
          <Section style={{ textAlign: 'center', marginTop: '30px' }}>
            <Button
              href={`http://localhost:3000/verify/${username}`}
              style={button}
            >
              Verify Your Account
            </Button>
          </Section>
          
          <Section style={footerText}>
            <Text>© 2024 Your Brand Name. All rights reserved.</Text>
          </Section>

        </Container>
      </Section>
    </Html>
  );
}