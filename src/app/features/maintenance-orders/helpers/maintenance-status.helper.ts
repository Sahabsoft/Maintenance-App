export function getStatusText(
  status: number
): string {

  switch (status) {

    case 1:
      return 'مستلم';

    case 2:
      return 'فحص';

    case 3:
      return 'انتظار الموافقة';
    
      case 4: return 'إصلاح';

   
     case 5:
         return 'جاهز للتسليم';
case 6:
  
      return 'تم التسليم';

  case 7:  
      return 'غير قابل للإصلاح';

    default:
      return '';
  }
}