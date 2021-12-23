import { useFormik } from 'formik';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-root-toast';
import { isError, useMutation } from 'react-query';
import useTheme from '../hooks/theme';
import {
  Credentials,
  CredentialsSchema,
  initialCredentials,
} from '../models/devices';
import { mutateCredentials } from '../services/devices';
import Button from './Button';
import Input from './Input';
import Link from './Link';

const validateCredentials = (credentials: Credentials) => {
  const result = CredentialsSchema.safeParse(credentials);
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 20,
  },
  item: {
    marginVertical: 20,
  },
});

export interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { theme } = useTheme();
  const [loadingToast, setLoadingToast] = React.useState<Toast | null>(null);
  const credentialsMutation = useMutation(mutateCredentials, {
    onSuccess: () => {
      if (loadingToast) {
        Toast.hide(loadingToast);
      }
      Toast.show('Device connected!', {
        backgroundColor: theme.colors.bg.success,
        duration: Toast.durations.SHORT,
      });
    },
  });
  const handleError = React.useCallback(
    (error: unknown) => {
      Toast.show(
        `Connection failed: ${
          isError(error) ? error.message : 'Unknown reason'
        }`,
        {
          backgroundColor: theme.colors.bg.danger,
          duration: Toast.durations.SHORT,
        },
      );
    },
    [theme.colors.bg.danger],
  );

  const handleCredentialsSubmit = React.useCallback(
    (values: Credentials) => {
      const toast = Toast.show('Connecting to the device', {
        backgroundColor: theme.colors.bg.info,
        duration: 10000,
      });
      setLoadingToast(toast);
      return credentialsMutation.mutateAsync(values).catch(handleError);
    },
    [credentialsMutation, handleError, theme.colors.bg.info],
  );

  const credentialsForm = useFormik({
    initialValues: initialCredentials,
    onSubmit: handleCredentialsSubmit,
    validate: validateCredentials,
  });

  const ip = React.useMemo(() => {
    if (credentialsMutation.data?.success) {
      return credentialsMutation.data.data.ip;
    } else {
      return null;
    }
  }, [credentialsMutation.data]);

  return (
    <View style={styles.wrapper}>
      <View>
        <Input
          label="SSID"
          placeholder="wifi_network_name"
          errorMessage={
            credentialsForm.touched.ssid && credentialsForm.errors.ssid
          }
          value={credentialsForm.values.ssid}
          onChangeText={credentialsForm.handleChange('ssid')}
          onBlur={credentialsForm.handleBlur('ssid')}
        />
        <Input
          label="Password"
          textContentType="password"
          errorMessage={
            credentialsForm.touched.password && credentialsForm.errors.password
          }
          value={credentialsForm.values.password}
          onChangeText={credentialsForm.handleChange('password')}
          onBlur={credentialsForm.handleBlur('password')}
        />
        <Button
          style={styles.item}
          onPress={credentialsForm.submitForm}
          disabled={!credentialsForm.isValid}
          loading={credentialsForm.isSubmitting}
        >
          Connect New Device
        </Button>
      </View>
      <Link to={ip ? `device/${ip}` : ''} disabled={!ip}>
        Edit Pixels
      </Link>
    </View>
  );
};

export default Dashboard;
