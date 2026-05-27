# Luxury UI Components

A collection of reusable luxury-styled UI components for the Premium Agricultural Marketplace.

## Components

### Button

Luxury button component with multiple variants and sizes.

**Variants:** `primary`, `secondary`, `outline`, `ghost`  
**Sizes:** `sm`, `md`, `lg`

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" onClick={handleClick}>
  Add to Cart
</Button>
```

### Card

Minimal card component with hover reveal effects.

```tsx
import { Card, CardHeader, CardBody, CardFooter, CardImage } from '@/components/ui';

<Card hover>
  <CardImage src="/product.jpg" alt="Product" />
  <CardHeader>
    <h3>Product Name</h3>
  </CardHeader>
  <CardBody>
    <p>Product description</p>
  </CardBody>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

### Input

Refined input components with labels, errors, and helper text.

```tsx
import { Input, Textarea, Select } from '@/components/ui';

<Input 
  label="Email" 
  type="email" 
  error={errors.email}
  helperText="We'll never share your email"
/>

<Textarea 
  label="Description" 
  rows={4}
/>

<Select 
  label="Customer Type"
  options={[
    { value: 'B2C', label: 'Individual' },
    { value: 'B2B', label: 'Business' }
  ]}
/>
```

### Badge

Status indicator badges with multiple variants.

```tsx
import { Badge, StatusBadge } from '@/components/ui';

<Badge variant="success">New</Badge>
<Badge variant="warning" size="sm">Limited</Badge>

<StatusBadge status="in-stock" />
<StatusBadge status="low-stock" />
<StatusBadge status="out-of-stock" />
```

### Modal

Modal dialog with smooth transitions.

```tsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui';
import { Button } from '@/components/ui';

<Modal isOpen={isOpen} onClose={handleClose} size="md">
  <ModalHeader onClose={handleClose}>
    Confirm Action
  </ModalHeader>
  <ModalBody>
    <p>Are you sure you want to proceed?</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={handleClose}>Cancel</Button>
    <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
  </ModalFooter>
</Modal>
```

## Design Principles

- **Luxury Aesthetic**: Uses the luxury color palette (Deep Forest Green, Garden Lime, Teakwood Brown, Windsor Oak, Cream, Charcoal)
- **Smooth Transitions**: All components feature smooth micro-interactions and hover effects
- **Accessibility**: Components follow accessibility best practices with proper ARIA labels and keyboard navigation
- **Responsive**: All components are mobile-friendly and responsive
- **TypeScript**: Fully typed with TypeScript for better developer experience

## Requirements Satisfied

- **1.4**: Smooth micro-interactions including hover effects and transitions
- **1.5**: Product cards with minimal design and hover reveal interactions
- **1.6**: Professional iconography and refined styling
