// 'use client';

// import { useState, useEffect } from 'react';
// import { 
//   Users, 
//   BookOpen, 
//   Search, 
//   Filter,
//   Trash2,
//   ChevronDown,
//   BookPlus
// } from 'lucide-react';

// interface Guide {
//   id: string;
//   title: string;
//   dateAssigned: string;
// }

// interface Trainee {
//   id: string;
//   name: string;
//   email: string;
//   department: string;
//   assignedGuides: Guide[];
// }

// // Sample data - replace with actual data fetching


// export default function TraineesPage() {
//   const [trainees, setTrainees] = useState<Trainee[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [expandedTrainee, setExpandedTrainee] = useState<string | null>(null);
//   const [showGuideModal, setShowGuideModal] = useState(false);
//   const [selectedTrainee, setSelectedTrainee] = useState<string | null>(null);

//   useEffect(() => {
//     fetchTrainees();
//   }, []);

//   const fetchTrainees = async () => {
//     try {
//       const response = await ApiService.get(
//         API_CONFIG.ENDPOINTS.TRAINEES.LIST,
//         true // requires auth
//       );
//       setTrainees(response.data);
//     } catch (error) {
//       // Handle error
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteGuide = (traineeId: string, guideId: string) => {
//     // Implement guide deletion logic
//     console.log('Deleting guide:', guideId, 'from trainee:', traineeId);
//   };

//   const handleAssignGuide = async (traineeId: string, guideId: string) => {
//     try {
//       const formData = new FormData();
//       formData.append('trainee_id', traineeId);
//       formData.append('guide_id', guideId);

//       await ApiService.post(
//         API_CONFIG.ENDPOINTS.TRAINEES.ASSIGN_GUIDE,
//         formData,
//         true // requires auth
//       );

//       // Refresh trainees list
//       fetchTrainees();
//     } catch (error) {
//       // Handle error
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header Section */}
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-olive">Trainees Management</h1>
//             <p className="mt-2 text-khaki-dark">Manage trainees and their assigned maintenance guides</p>
//           </div>
//         </div>

//         {/* Search and Filter Bar */}
//         <div className="bg-white rounded-lg shadow-sm border border-brass-light/20 p-4">
//           <div className="flex gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-khaki" />
//               <input
//                 type="text"
//                 placeholder="Search trainees..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 rounded-lg border border-brass-light/20 focus:outline-none focus:ring-1 focus:ring-brass-light text-olive-dark placeholder-khaki/50"
//               />
//             </div>
//             <button className="inline-flex items-center px-4 py-2 bg-white border border-brass-light/20 text-olive hover:bg-olive-light/10 rounded-lg text-sm font-medium transition-colors duration-200">
//               <Filter className="w-4 h-4 mr-2" />
//               Filter
//             </button>
//           </div>
//         </div>

//         {/* Trainees List */}
//         <div className="space-y-4">
//           {trainees.map((trainee) => (
//             <div
//               key={trainee.id}
//               className="bg-white rounded-lg shadow-sm border border-brass-light/20"
//             >
//               {/* Trainee Header */}
//               <div 
//                 className="p-6 cursor-pointer"
//                 onClick={() => setExpandedTrainee(expandedTrainee === trainee.id ? null : trainee.id)}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     <div className="p-2 bg-olive-light/10 rounded-full">
//                       <Users className="w-6 h-6 text-olive" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold text-olive">{trainee.name}</h3>
//                       <p className="text-sm text-khaki-dark">{trainee.email}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <span className="text-sm text-khaki-dark">
//                       {trainee.assignedGuides.length} guides assigned
//                     </span>
//                     <ChevronDown 
//                       className={`w-5 h-5 text-khaki transition-transform ${
//                         expandedTrainee === trainee.id ? 'transform rotate-180' : ''
//                       }`}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Expanded Content */}
//               {expandedTrainee === trainee.id && (
//                 <div className="border-t border-brass-light/20 p-6">
//                   <div className="flex justify-between items-center mb-4">
//                     <h4 className="text-sm font-medium text-olive">Assigned Guides</h4>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelectedTrainee(trainee.id);
//                         setShowGuideModal(true);
//                       }}
//                       className="inline-flex items-center px-3 py-1.5 bg-brass hover:bg-brass-light text-olive-dark rounded-lg text-sm font-medium transition-colors duration-200"
//                     >
//                       <BookPlus className="w-4 h-4 mr-2" />
//                       Assign New Guide
//                     </button>
//                   </div>
                  
//                   <div className="space-y-3">
//                     {trainee.assignedGuides.map((guide) => (
//                       <div
//                         key={guide.id}
//                         className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-olive-light/5 transition-colors"
//                       >
//                         <div className="flex items-center space-x-3">
//                           <BookOpen className="w-5 h-5 text-olive" />
//                           <div>
//                             <p className="text-sm font-medium text-olive">{guide.title}</p>
//                             <p className="text-xs text-khaki-dark">Assigned: {guide.dateAssigned}</p>
//                           </div>
//                         </div>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleDeleteGuide(trainee.id, guide.id);
//                           }}
//                           className="p-1.5 text-khaki hover:text-brass hover:bg-olive-light/10 rounded-lg transition-colors"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Guide Assignment Modal - Add implementation as needed */}
//       {showGuideModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
//           {/* Modal content */}
//         </div>
//       )}
//     </div>
//   );
// }
