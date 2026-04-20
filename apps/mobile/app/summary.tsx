import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDashboardStore } from '@/presentation/store/cartStore';

export default function SummaryScreen() {
  const router = useRouter();
  const addedItems = useDashboardStore(s => s.addedItems);
  const orderForm = useDashboardStore(s => s.orderForm);
  const reset = useDashboardStore(s => s.reset);

  const totalQty = addedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = addedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const clientProfile = orderForm?.clientProfileData;
  const shippingAddress = orderForm?.shippingData?.address || orderForm?.shippingData?.selectedAddresses?.[0];

  const handleRestart = () => {
    reset();
    router.dismissAll();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{
            width: 64, height: 64, borderRadius: 32, backgroundColor: '#22c55e',
            alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <Text style={{ fontSize: 28 }}>✓</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center' }}>
            Flujo completado
          </Text>
          <Text style={{ color: '#71717a', fontSize: 14, textAlign: 'center', marginTop: 6, lineHeight: 20 }}>
            Todos los pasos del SDK VTEX se ejecutaron exitosamente
          </Text>
        </View>

        {/* Products added */}
        <View style={{ backgroundColor: '#18181b', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#27272a', marginBottom: 16 }}>
          <Text style={{ color: '#52525b', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 }}>
            PRODUCTOS AÑADIDOS ({totalQty})
          </Text>

          {addedItems.map((item, idx) => (
            <View key={idx} style={{
              flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
              borderTopWidth: idx > 0 ? 1 : 0, borderTopColor: '#27272a',
            }}>
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{ width: 52, height: 52, borderRadius: 10, backgroundColor: '#fff', marginRight: 14 }}
                  resizeMode="contain"
                />
              ) : (
                <View style={{ width: 52, height: 52, borderRadius: 10, backgroundColor: '#27272a', marginRight: 14, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 20 }}>🍷</Text>
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }} numberOfLines={1}>{item.name}</Text>
                <Text style={{ color: '#71717a', fontSize: 11, marginTop: 2 }}>
                  SKU: {item.skuId} · Cant: {item.quantity} · Seller: {item.seller}
                </Text>
              </View>

              <Text style={{ color: '#22c55e', fontSize: 15, fontWeight: '800', marginLeft: 8 }}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

          {/* Total */}
          <View style={{ borderTopWidth: 1, borderTopColor: '#3f3f46', marginTop: 8, paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#a1a1aa', fontSize: 14, fontWeight: '600' }}>Total</Text>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>${totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        {/* Client Profile */}
        {clientProfile && (
          <View style={{ backgroundColor: '#18181b', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#27272a', marginBottom: 16 }}>
            <Text style={{ color: '#52525b', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
              DATOS DEL CLIENTE
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: '#71717a', fontSize: 13 }}>Nombre</Text>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{clientProfile.firstName} {clientProfile.lastName}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: '#71717a', fontSize: 13 }}>Email</Text>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{clientProfile.email}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: '#71717a', fontSize: 13 }}>Teléfono</Text>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{clientProfile.homePhone || clientProfile.phone}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#71717a', fontSize: 13 }}>Documento</Text>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{clientProfile.document} ({clientProfile.documentType})</Text>
            </View>
          </View>
        )}

        {/* Shipping */}
        {shippingAddress && (
          <View style={{ backgroundColor: '#18181b', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#27272a', marginBottom: 16 }}>
            <Text style={{ color: '#52525b', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
              DIRECCIÓN DE ENVÍO
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: '#71717a', fontSize: 13 }}>Receptor</Text>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{shippingAddress.receiverName}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: '#71717a', fontSize: 13 }}>Dirección</Text>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{shippingAddress.street} #{shippingAddress.number}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#71717a', fontSize: 13 }}>Ciudad</Text>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{shippingAddress.city}, {shippingAddress.country}</Text>
            </View>
          </View>
        )}

        {/* OrderForm ID */}
        <View style={{ backgroundColor: '#18181b', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#27272a', marginBottom: 24 }}>
          <Text style={{ color: '#52525b', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
            ORDER FORM ID
          </Text>
          <Text style={{ color: '#22c55e', fontSize: 12, fontFamily: 'monospace' }}>
            {orderForm?.orderFormId || 'N/A'}
          </Text>
        </View>

        {/* Restart */}
        <TouchableOpacity
          style={{ backgroundColor: '#2563eb', paddingVertical: 18, borderRadius: 16, alignItems: 'center' }}
          onPress={handleRestart}
          activeOpacity={0.8}
        >
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>Reiniciar flujo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
