import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { UseCaseTypes } from '@/domain/entity/Types/UseCaseTypes';
import { SetClientProfileUseCase } from '@/domain/interactors/Checkout/SetClientProfileUseCase';
import container from '@/presentation/config/inversify/container';
import { useDashboardStore } from '@/presentation/store/cartStore';

const DEFAULT_DOC_TYPE = 'cedula';

export default function ProfileScreen() {
  const router = useRouter();
  const orderFormId = useDashboardStore(s => s.orderFormId);
  const setOrderForm = useDashboardStore(s => s.setOrderForm);
  const reset = useDashboardStore(s => s.reset);
  const uc = container.get<SetClientProfileUseCase>(UseCaseTypes.SetClientProfileUseCase);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    document: '',
    documentType: DEFAULT_DOC_TYPE,
  });

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = Object.values(form).every(v => v.trim().length > 0);

  const handleSubmit = async () => {
    if (!orderFormId) return;
    setLoading(true);
    setError(null);
    try {
      const profileData = {
        document: form.document,
        documentType: form.documentType,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        homePhone: form.phone,
      };

      const updated: any = await uc.execute(orderFormId, profileData);
      setOrderForm(updated);
      setDone(true);
    } catch (e: any) {
      setError(e?.message || 'Error adjuntando perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    router.push('/summary');
  };

  const inputStyle = {
    backgroundColor: '#27272a', color: '#fff', padding: 14, borderRadius: 12,
    fontSize: 16, borderWidth: 1, borderColor: '#3f3f46',
  } as const;
  const labelStyle = {
    color: '#52525b', fontSize: 11, fontWeight: '700' as const,
    letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 6,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: done ? '#22c55e' : '#2563eb', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>{done ? '✓' : '6'}</Text>
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 17 }}>Client profile</Text>
            <Text style={{ color: '#71717a', fontSize: 12 }}>Adjunta los datos de identidad del cliente</Text>
          </View>
        </View>

        {/* Form */}
        <View style={{ backgroundColor: '#18181b', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#27272a' }}>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>NOMBRE</Text>
              <TextInput style={inputStyle} placeholder="Mauricio" placeholderTextColor="#52525b" value={form.firstName} onChangeText={v => updateField('firstName', v)} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>APELLIDO</Text>
              <TextInput style={inputStyle} placeholder="Matango" placeholderTextColor="#52525b" value={form.lastName} onChangeText={v => updateField('lastName', v)} />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>EMAIL</Text>
              <TextInput style={inputStyle} placeholder="test@test.com" placeholderTextColor="#52525b" value={form.email} onChangeText={v => updateField('email', v)} keyboardType="email-address" autoCapitalize="none" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>TELÉFONO</Text>
              <TextInput style={inputStyle} placeholder="+5930000000000" placeholderTextColor="#52525b" value={form.phone} onChangeText={v => updateField('phone', v)} keyboardType="phone-pad" />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>DOCUMENTO</Text>
              <TextInput style={inputStyle} placeholder="0000000000" placeholderTextColor="#52525b" value={form.document} onChangeText={v => updateField('document', v)} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>TIPO DOC.</Text>
              <TextInput style={inputStyle} value={form.documentType} onChangeText={v => updateField('documentType', v)} />
            </View>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: done ? '#22c55e' : (isFormValid ? '#2563eb' : '#3f3f46'),
              paddingVertical: 16, borderRadius: 14, alignItems: 'center',
              opacity: loading ? 0.6 : 1,
            }}
            onPress={handleSubmit}
            disabled={loading || !isFormValid || done}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                {done ? '✓ Perfil adjuntado' : 'Adjuntar perfil'}
              </Text>
            )}
          </TouchableOpacity>

          {error && <Text style={{ color: '#ef4444', marginTop: 10, fontSize: 13, textAlign: 'center' }}>{error}</Text>}
        </View>

        {/* Finish */}
        {done && (
          <TouchableOpacity
            style={{ backgroundColor: '#22c55e', paddingVertical: 18, borderRadius: 16, marginTop: 20, alignItems: 'center' }}
            onPress={handleFinish}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>🎉 Flujo completado — Reiniciar</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
