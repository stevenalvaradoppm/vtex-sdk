import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Image,
  Modal, TextInput, Dimensions, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { UseCaseTypes } from '@/domain/entity/Types/UseCaseTypes';
import { CreateOrderFormUseCase } from '@/domain/interactors/Checkout/CreateOrderFormUseCase';
import { GetProductsUseCase } from '@/domain/interactors/Checkout/GetProductsUseCase';
import { AddItemUseCase } from '@/domain/interactors/Checkout/AddItemUseCase';
import container from '@/presentation/config/inversify/container';
import { useDashboardStore } from '@/presentation/store/cartStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 12) / 2;

export default function ProductsScreen() {
  const router = useRouter();
  const orderFormId = useDashboardStore(s => s.orderFormId);
  const setOrderForm = useDashboardStore(s => s.setOrderForm);
  const setProducts = useDashboardStore(s => s.setProducts);
  const addedItems = useDashboardStore(s => s.addedItems);
  const addItemToList = useDashboardStore(s => s.addItemToList);

  const createOrderFormUc = container.get<CreateOrderFormUseCase>(UseCaseTypes.CreateOrderFormUseCase);
  const getProductsUc = container.get<GetProductsUseCase>(UseCaseTypes.GetProductsUseCase);
  const addItemUc = container.get<AddItemUseCase>(UseCaseTypes.AddItemUseCase);

  const [cartReady, setCartReady] = useState(false);
  const [productList, setProductList] = useState<any[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [qty, setQty] = useState('1');
  const [seller, setSeller] = useState('1');
  const [addingItem, setAddingItem] = useState(false);
  const [itemAdded, setItemAdded] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  }, []);

  // Auto-create cart + auto-fetch products on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const orderForm: any = await createOrderFormUc.execute();
        if (cancelled) return;
        setOrderForm(orderForm);
        setCartReady(true);
        setLoadingCart(false);
        showToast(`✓ Carrito creado`);

        setLoadingProducts(true);
        const data: any = await getProductsUc.execute();
        if (cancelled) return;
        const list = data?.products || (Array.isArray(data) ? data : []);
        setProductList(list);
        setProducts(data);
        setLoadingProducts(false);
      } catch (e: any) {
        if (!cancelled) {
          setInitError(e?.message || 'Error inicializando');
          setLoadingCart(false);
          setLoadingProducts(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleProductTap = (product: any) => {
    setSelectedProduct(product);
    setQty('1');
    setSeller('1');
    setItemAdded(false);
    setModalVisible(true);
  };

  const handleAddItem = async () => {
    if (!orderFormId || !selectedProduct) return;
    setAddingItem(true);
    try {
      const skuId = String(selectedProduct?.items?.[0]?.itemId || selectedProduct?.productId || '');
      const updated: any = await addItemUc.execute(orderFormId, [
        { id: skuId, quantity: Number(qty), seller },
      ]);
      setOrderForm(updated);
      setItemAdded(true);

      addItemToList({
        skuId,
        name: selectedProduct?.productName || 'Producto',
        imageUrl: getProductImage(selectedProduct),
        price: getProductPrice(selectedProduct),
        quantity: Number(qty),
        seller,
      });

      showToast(`✓ ${selectedProduct?.productName || 'Item'} añadido`);
      setTimeout(() => setModalVisible(false), 600);
    } catch (e: any) {
      showToast(`✗ Error: ${e?.message || 'Error añadiendo item'}`);
    } finally {
      setAddingItem(false);
    }
  };

  const getProductImage = (product: any) =>
    product?.items?.[0]?.images?.[0]?.imageUrl || null;

  const getProductPrice = (product: any) => {
    return product?.items?.[0]?.sellers?.[0]?.commertialOffer?.Price
      || product?.priceRange?.sellingPrice?.lowPrice
      || 0;
  };

  const hasItems = addedItems.length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{ color: '#52525b', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Catálogo VTEX
          </Text>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800' }}>Productos</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {hasItems && (
            <View style={{ backgroundColor: '#22c55e', width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>{addedItems.length}</Text>
            </View>
          )}
          <TouchableOpacity
            style={{
              backgroundColor: hasItems ? '#2563eb' : '#27272a',
              paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
              opacity: hasItems ? 1 : 0.4,
            }}
            onPress={() => router.push('/shipping')}
            disabled={!hasItems}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Shipping →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading states */}
      {(loadingCart || loadingProducts) && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ color: '#71717a', marginTop: 12, fontSize: 14 }}>
            {loadingCart ? 'Creando carrito...' : 'Cargando productos...'}
          </Text>
        </View>
      )}

      {initError && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ color: '#ef4444', fontSize: 15, textAlign: 'center' }}>{initError}</Text>
        </View>
      )}

      {/* Product Grid */}
      {!loadingCart && !loadingProducts && productList.length > 0 && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {productList.map((product: any, idx: number) => {
              const imageUrl = getProductImage(product);
              const price = getProductPrice(product);
              const name = product?.productName || 'Sin nombre';
              const skuId = product?.items?.[0]?.itemId || 'N/A';
              const isAdded = addedItems.some(i => i.skuId === String(skuId));

              return (
                <TouchableOpacity
                  key={product?.productId || idx}
                  style={{
                    width: CARD_WIDTH,
                    backgroundColor: '#18181b',
                    borderRadius: 16,
                    marginBottom: 12,
                    borderWidth: 1.5,
                    borderColor: isAdded ? '#22c55e' : '#27272a',
                    overflow: 'hidden',
                  }}
                  onPress={() => handleProductTap(product)}
                  activeOpacity={0.7}
                >
                  {imageUrl ? (
                    <Image
                      source={{ uri: imageUrl }}
                      style={{ width: '100%', height: CARD_WIDTH, backgroundColor: '#fff' }}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={{ width: '100%', height: CARD_WIDTH, backgroundColor: '#27272a', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ color: '#52525b', fontSize: 32 }}>🍷</Text>
                    </View>
                  )}
                  <View style={{ padding: 12 }}>
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600', marginBottom: 4 }} numberOfLines={2}>
                      {name}
                    </Text>
                    <Text style={{ color: '#71717a', fontSize: 10, marginBottom: 4 }}>SKU: {skuId}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      {price > 0 && (
                        <Text style={{ color: '#22c55e', fontSize: 15, fontWeight: '800' }}>
                          ${price.toFixed(2)}
                        </Text>
                      )}
                      {isAdded && (
                        <View style={{ backgroundColor: '#22c55e', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>Añadido</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Add Item Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#18181b', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 44 : 24 }}>
            <View style={{ width: 40, height: 4, backgroundColor: '#3f3f46', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

            {selectedProduct && (
              <>
                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                  {getProductImage(selectedProduct) && (
                    <Image
                      source={{ uri: getProductImage(selectedProduct)! }}
                      style={{ width: 80, height: 80, borderRadius: 12, backgroundColor: '#fff', marginRight: 16 }}
                      resizeMode="contain"
                    />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }} numberOfLines={2}>
                      {selectedProduct.productName}
                    </Text>
                    <Text style={{ color: '#71717a', fontSize: 12, marginTop: 4 }}>
                      SKU: {selectedProduct?.items?.[0]?.itemId || 'N/A'}
                    </Text>
                    {getProductPrice(selectedProduct) > 0 && (
                      <Text style={{ color: '#22c55e', fontSize: 20, fontWeight: '800', marginTop: 4 }}>
                        ${getProductPrice(selectedProduct).toFixed(2)}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#52525b', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>CANTIDAD</Text>
                    <TextInput
                      style={{ backgroundColor: '#27272a', color: '#fff', padding: 14, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#3f3f46', textAlign: 'center' }}
                      value={qty} onChangeText={setQty} keyboardType="numeric"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#52525b', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>SELLER</Text>
                    <TextInput
                      style={{ backgroundColor: '#27272a', color: '#fff', padding: 14, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#3f3f46', textAlign: 'center' }}
                      value={seller} onChangeText={setSeller}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: itemAdded ? '#22c55e' : '#2563eb',
                    paddingVertical: 16, borderRadius: 14, alignItems: 'center',
                    opacity: addingItem ? 0.6 : 1,
                  }}
                  onPress={handleAddItem}
                  disabled={addingItem || itemAdded}
                  activeOpacity={0.8}
                >
                  {addingItem ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                      {itemAdded ? '✓ Añadido al carrito' : 'Añadir al carrito'}
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={{ paddingVertical: 12, alignItems: 'center', marginTop: 4 }} onPress={() => setModalVisible(false)}>
                  <Text style={{ color: '#71717a', fontSize: 14 }}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Toast */}
      {toastMsg && (
        <View style={{
          position: 'absolute', bottom: Platform.OS === 'ios' ? 50 : 30,
          left: 24, right: 24, backgroundColor: '#27272a',
          paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14,
          borderWidth: 1, borderColor: '#3f3f46', alignItems: 'center',
        }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{toastMsg}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
