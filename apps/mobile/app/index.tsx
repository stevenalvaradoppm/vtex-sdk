import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Image } from 'expo-image';

const platformIconSource = Platform.OS === 'ios' 
  ? require('../assets/images/Apple_logo_grey.svg') 
  : require('../assets/images/android-icon-by-Vexels.png');
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { UseCaseTypes } from '@/domain/entity/Types/UseCaseTypes';
import { CreateSessionUseCase } from '@/domain/interactors/Checkout/CreateSessionUseCase';
import container from '@/presentation/config/inversify/container';
import { useDashboardStore } from '@/presentation/store/cartStore';

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function WelcomeScreen() {
  const router = useRouter();
  const setSessionCreated = useDashboardStore(s => s.setSessionCreated);
  const uc = container.get<CreateSessionUseCase>(UseCaseTypes.CreateSessionUseCase);

  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailError = touched && !isValidEmail(email) ? 'Ingresa un correo válido' : null;
  const canSubmit = isValidEmail(email) && !loading;

  const handleCreate = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      await uc.execute(email);
      setSessionCreated(true);
      router.replace('/products');
    } catch (e: any) {
      setError(e?.message || 'Error creando sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: 'center' }}>
          {/* Branding */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <Image 
              source={platformIconSource} 
              contentFit="contain" 
              style={{ width: 120, height: 120, marginBottom: 24 }} 
            />
            <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }}>
              VTEX Markteplace
            </Text>
            <Text style={{ color: '#71717a', fontSize: 15, marginTop: 6, textAlign: 'center', lineHeight: 22 }}>
              Plataforma de pruebas {'\n'}de comercio electrónico de VTEX
            </Text>
          </View>

          {/* Card */}
          <View style={{
            backgroundColor: '#18181b', borderRadius: 24, padding: 24,
            borderWidth: 1, borderColor: '#27272a',
          }}>
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700', marginBottom: 4 }}>
              Iniciar sesión
            </Text>
            <Text style={{ color: '#71717a', fontSize: 13, marginBottom: 20 }}>
              Ingresa tu correo para crear una sesión VTEX
            </Text>

            <Text style={{ color: '#52525b', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
              CORREO ELECTRÓNICO
            </Text>
            <TextInput
              style={{
                backgroundColor: '#27272a', color: '#fff', padding: 16, borderRadius: 14,
                fontSize: 16, borderWidth: 1.5,
                borderColor: emailError ? '#ef4444' : (email && isValidEmail(email) ? '#22c55e' : '#3f3f46'),
              }}
              placeholder="usuario@tienda.com"
              placeholderTextColor="#52525b"
              value={email}
              onChangeText={(t) => { setEmail(t); if (!touched) setTouched(true); }}
              onBlur={() => setTouched(true)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="go"
              onSubmitEditing={handleCreate}
            />
            {emailError && (
              <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 6, marginLeft: 4 }}>{emailError}</Text>
            )}

            <TouchableOpacity
              style={{
                backgroundColor: canSubmit ? '#2563eb' : '#27272a',
                paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 20,
                opacity: loading ? 0.7 : 1,
              }}
              onPress={handleCreate}
              disabled={!canSubmit}
              activeOpacity={0.8}
            >
              {loading ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Conectando...</Text>
                </View>
              ) : (
                <Text style={{ color: canSubmit ? '#fff' : '#52525b', fontWeight: '700', fontSize: 16 }}>
                  Crear sesión
                </Text>
              )}
            </TouchableOpacity>

            {error && (
              <View style={{ backgroundColor: '#1c1012', borderWidth: 1, borderColor: '#3b1219', borderRadius: 12, padding: 12, marginTop: 12 }}>
                <Text style={{ color: '#ef4444', fontSize: 13, textAlign: 'center' }}>{error}</Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <Text style={{ color: '#3f3f46', fontSize: 12, textAlign: 'center', marginTop: 32 }}>
            Powered by @repo/sdk • v1.0
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
