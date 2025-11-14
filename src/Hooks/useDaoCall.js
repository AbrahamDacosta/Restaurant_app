import React from 'react';

export default function useDaoCall(
  {daoCall, onFinish, onError},
  ...parameters
) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setLoadingError] = React.useState();
  const [data, setData] = React.useState();

  const call = React.useCallback(
    (...overwriteParameters) => {
      setIsLoading(true);
      setLoadingError();
      let finalParameters = parameters;

      if (overwriteParameters) finalParameters = overwriteParameters;

      daoCall(...finalParameters)
        .then(loadedData => {
          setData(loadedData);
          if (onFinish) onFinish(loadedData);
        })
        .catch(e => {
          if (onError) onError(e);

          // if (e.response)
          //   console.log(
          //     'error-response',
          //     e.response.status,
          //     e.response.data,
          //     e.response.headers,
          //     e.toJSON(),
          //     e.response,
          //   );
          setLoadingError(e);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [parameters],
  );

  return {call, isLoading, errors, data};
}
