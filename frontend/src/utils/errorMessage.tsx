import axios from 'axios';

const errorMessage = (error: unknown, title: string): string => {
  let message = title;

  if (axios.isAxiosError(error)) {
    if (error.response) {
      message += ` Data: ${JSON.stringify(error.response.data)}`;
    } else if (error.request) {
      message += ` No response. Data: ${error.request}`;
    } else {
      message += ` ${error.message}`;
    }
  } else if (error instanceof Error) {
    message += ` Other than Axios: ${error.message}`;
  }

  return (message);
};

export default errorMessage;
