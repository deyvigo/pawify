
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { RecoveryScreen } from './src/screens/RecoveryScreen';
import { NewPasswordScreen } from './src/screens/NewPasswordScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
    // return <LoginScreen />;
    // return <RegisterScreen />;
    
    // return <RecoveryScreen />;
    return(
      <SafeAreaProvider>
        <RecoveryScreen/>
    </SafeAreaProvider>
    );
    

}

