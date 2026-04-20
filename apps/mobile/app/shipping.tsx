import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { UseCaseTypes } from '@/domain/entity/Types/UseCaseTypes';
import { SetShippingUseCase } from '@/domain/interactors/Checkout/SetShippingUseCase';
import container from '@/presentation/config/inversify/container';
import { useDashboardStore } from '@/presentation/store/cartStore';

const DEFAULTS = {
  country: 'ECU',
  sla: 'normal',
  lat: '-0.1807',
  lng: '-78.4678',
};

export default function ShippingScreen() {
  const router = useRouter();
  const orderFormId = useDashboardStore(s => s.orderFormId);
  const setOrderForm = useDashboardStore(s => s.setOrderForm);
  const uc = container.get<SetShippingUseCase>(UseCaseTypes.SetShippingUseCase);

  const [form, setForm] = useState({
    receiver: '',
    country: DEFAULTS.country,
    city: '',
    street: '',
    number: '',
    sla: DEFAULTS.sla,
    complement: '',
    lat: DEFAULTS.lat,
    lng: DEFAULTS.lng,
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
      const geoCoordinates = (form.lat && form.lng)
        ? [parseFloat(form.lng), parseFloat(form.lat)]
        : [];

      const shippingData = {
        clearAddressIfPostalCodeNotFound: false,
        logisticsInfo: {
          itemIndex: 0,
          selectedDeliveryChannel: 'delivery',
          selectedSla: form.sla,
        },
        selectedAddresses: [{
          addressName: 'home',
          addressType: 'residential',
          city: form.city,
          country: form.country,
          geoCoordinates,
          number: form.number,
          receiverName: form.receiver,
          street: form.street,
          complement: form.complement,
        }],
      };

      const updated: any = await uc.execute(orderFormId, shippingData);
      setOrderForm(updated);
      setDone(true);
    } catch (e: any) {
      setError(e?.message || 'Error adjuntando shipping');
    } finally {
      setLoading(false);
    }
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
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>{done ? '✓' : '5'}</Text>
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 17 }}>Shipping data</Text>
            <Text style={{ color: '#71717a', fontSize: 12 }}>Adjunta la dirección y opciones de envío</Text>
          </View>
        </View>

        {/* Form */}
        <View style={{ backgroundColor: '#18181b', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#27272a' }}>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>RECEPTOR</Text>
              <TextInput style={inputStyle} placeholder="Test User" placeholderTextColor="#52525b" value={form.receiver} onChangeText={v => updateField('receiver', v)} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>PAÍS</Text>
              <TextInput style={inputStyle} value={form.country} onChangeText={v => updateField('country', v)} />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>CIUDAD</Text>
              <TextInput style={inputStyle} placeholder="Quito" placeholderTextColor="#52525b" value={form.city} onChangeText={v => updateField('city', v)} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>CALLE</Text>
              <TextInput style={inputStyle} placeholder="Av. Example" placeholderTextColor="#52525b" value={form.street} onChangeText={v => updateField('street', v)} />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>NÚMERO</Text>
              <TextInput style={inputStyle} placeholder="123" placeholderTextColor="#52525b" value={form.number} onChangeText={v => updateField('number', v)} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>SLA</Text>
              <TextInput style={inputStyle} value={form.sla} onChangeText={v => updateField('sla', v)} />
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>COMPLEMENTO</Text>
              <TextInput style={inputStyle} placeholder="Apto 101" placeholderTextColor="#52525b" value={form.complement} onChangeText={v => updateField('complement', v)} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={labelStyle}>LAT</Text>
              <TextInput style={inputStyle} value={form.lat} onChangeText={v => updateField('lat', v)} keyboardType="numeric" />
            </View>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={labelStyle}>LNG</Text>
            <TextInput style={{ ...inputStyle, width: '48%' }} value={form.lng} onChangeText={v => updateField('lng', v)} keyboardType="numeric" />
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
                {done ? '✓ Shipping adjuntado' : 'Adjuntar shipping'}
              </Text>
            )}
          </TouchableOpacity>

          {error && <Text style={{ color: '#ef4444', marginTop: 10, fontSize: 13, textAlign: 'center' }}>{error}</Text>}
        </View>

        {/* Next */}
        {done && (
          <TouchableOpacity
            style={{ backgroundColor: '#22c55e', paddingVertical: 18, borderRadius: 16, marginTop: 20, alignItems: 'center' }}
            onPress={() => router.push('/profile')}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Client Profile →</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
