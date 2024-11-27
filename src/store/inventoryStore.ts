import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  runTransaction,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { productSchema } from '../lib/validation';

interface InventoryState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  adjustStock: (id: string, adjustment: number, batchNumber: string) => Promise<void>;
  getLowStockProducts: (threshold: number) => Product[];
  getExpiringProducts: (daysThreshold: number) => Product[];
  getProductsByBatch: (batchNumber: string) => Product[];
  trackStockMovement: (productId: string, quantity: number, type: 'in' | 'out', batchNumber: string) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const q = query(collection(db, 'products'), orderBy('expiryDate', 'asc'));
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        expiryDate: doc.data().expiryDate?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Product[];
      set({ products, loading: false });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ error: 'Failed to fetch products', loading: false });
    }
  },

  addProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      productSchema.parse(product);

      const skuQuery = query(collection(db, 'products'), where('sku', '==', product.sku));
      const skuSnapshot = await getDocs(skuQuery);
      if (!skuSnapshot.empty) {
        throw new Error('A product with this SKU already exists');
      }

      // Add stock movement record
      await addDoc(collection(db, 'stockMovements'), {
        productSku: product.sku,
        quantity: product.quantity,
        type: 'in',
        batchNumber: product.batchNumber,
        timestamp: serverTimestamp(),
      });

      await addDoc(collection(db, 'products'), {
        ...product,
        expiryDate: new Date(product.expiryDate),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      await get().fetchProducts();
    } catch (error: any) {
      console.error('Error adding product:', error);
      set({ error: error.message || 'Failed to add product', loading: false });
      throw error;
    }
  },

  updateProduct: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const productRef = doc(db, 'products', id);
      
      if (updates.sku) {
        const skuQuery = query(collection(db, 'products'), where('sku', '==', updates.sku));
        const skuSnapshot = await getDocs(skuQuery);
        if (!skuSnapshot.empty && skuSnapshot.docs[0].id !== id) {
          throw new Error('A product with this SKU already exists');
        }
      }

      await updateDoc(productRef, {
        ...updates,
        expiryDate: updates.expiryDate ? new Date(updates.expiryDate) : undefined,
        updatedAt: serverTimestamp(),
      });
      
      await get().fetchProducts();
    } catch (error: any) {
      console.error('Error updating product:', error);
      set({ error: error.message || 'Failed to update product', loading: false });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const shipmentsQuery = query(
        collection(db, 'shipments'),
        where('products', 'array-contains', { productId: id })
      );
      const shipmentsSnapshot = await getDocs(shipmentsQuery);
      
      if (!shipmentsSnapshot.empty) {
        throw new Error('Cannot delete product as it is part of active shipments');
      }

      await deleteDoc(doc(db, 'products', id));
      await get().fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      set({ error: error.message || 'Failed to delete product', loading: false });
      throw error;
    }
  },

  adjustStock: async (id: string, adjustment: number, batchNumber: string) => {
    set({ loading: true, error: null });
    try {
      const productRef = doc(db, 'products', id);
      
      await runTransaction(db, async (transaction) => {
        const productDoc = await transaction.get(productRef);
        if (!productDoc.exists()) {
          throw new Error('Product not found');
        }

        const newQuantity = productDoc.data().quantity + adjustment;
        if (newQuantity < 0) {
          throw new Error('Insufficient stock');
        }

        // Track stock movement
        await get().trackStockMovement(
          id,
          Math.abs(adjustment),
          adjustment > 0 ? 'in' : 'out',
          batchNumber
        );

        transaction.update(productRef, { 
          quantity: newQuantity,
          updatedAt: serverTimestamp()
        });
      });

      await get().fetchProducts();
    } catch (error: any) {
      console.error('Error adjusting stock:', error);
      set({ error: error.message || 'Failed to adjust stock', loading: false });
      throw error;
    }
  },

  getLowStockProducts: (threshold: number) => {
    return get().products.filter(product => product.quantity <= threshold);
  },

  getExpiringProducts: (daysThreshold: number) => {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    return get().products.filter(product => {
      const expiryDate = new Date(product.expiryDate);
      return expiryDate <= thresholdDate;
    });
  },

  getProductsByBatch: (batchNumber: string) => {
    return get().products.filter(product => product.batchNumber === batchNumber);
  },

  trackStockMovement: async (productId: string, quantity: number, type: 'in' | 'out', batchNumber: string) => {
    try {
      await addDoc(collection(db, 'stockMovements'), {
        productId,
        quantity,
        type,
        batchNumber,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error tracking stock movement:', error);
      throw error;
    }
  },
}));