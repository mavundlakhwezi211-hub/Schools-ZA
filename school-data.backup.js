/* UrSKOOL offline school directory.
 *
 * Used as the guaranteed fallback by school-search.js: when the live
 * UniApplyForMe Labs API cannot be reached (no browser token in env.js and
 * no PHP proxy running), searches run against this list instead of failing.
 * Keep entries as { name, province } using the same province labels as the
 * profile form. Omit `province` (or leave '') when unsure - the dropdown
 * label builder skips blanks. Never invent EMIS numbers here.
 */
window.URSKOOL_SCHOOL_DIRECTORY = [
    { name: 'Acornhoek Secondary', province: 'Mpumalanga' },
    { name: 'Alexandra High School', province: 'Gauteng' },
    { name: 'Belhar High School', province: 'Western Cape' },
    { name: 'Boitshepi Secondary School', province: '' },
    { name: 'Bryanston High School', province: 'Gauteng' },
    { name: 'Casteel Secondary', province: 'Mpumalanga' },
    { name: 'Curro Durbanville', province: 'Western Cape' },
    { name: 'Durban Girls College', province: 'KwaZulu-Natal' },
    { name: 'Durban High School', province: 'KwaZulu-Natal' },
    { name: 'Dwarsloop Secondary', province: 'Mpumalanga' },
    { name: 'East London Secondary School', province: 'Eastern Cape' },
    { name: 'Eunice High School', province: 'Free State' },
    { name: 'Glenwood High School', province: 'KwaZulu-Natal' },
    { name: 'Grey College', province: 'Free State' },
    { name: 'Grey High School', province: 'Eastern Cape' },
    { name: 'Hazyview Comprehensive School', province: 'Mpumalanga' },
    { name: 'Ho\u00ebrskool Merensky', province: 'Limpopo' },
    { name: 'Hoxani Secondary', province: 'Mpumalanga' },
    { name: 'Jeppe High School for Boys', province: 'Gauteng' },
    { name: 'Khanyisani Secondary School', province: 'Mpumalanga' },
    { name: 'Kimberley Boys High School', province: 'Northern Cape' },
    { name: 'King Edward VII School', province: 'Gauteng' },
    { name: 'KwaMashu Secondary School', province: 'KwaZulu-Natal' },
    { name: 'Lekazi Secondary', province: 'Mpumalanga' },
    { name: 'Mapulaneng Secondary', province: 'Mpumalanga' },
    { name: 'Maritzburg College', province: 'KwaZulu-Natal' },
    { name: 'Masoyi Secondary', province: 'Mpumalanga' },
    { name: 'Matsulu Secondary', province: 'Mpumalanga' },
    { name: 'Maviljan Secondary', province: 'Mpumalanga' },
    { name: 'Mkhuhlu East Secondary', province: 'Mpumalanga' },
    { name: 'Mkhuhlu Secondary', province: 'Mpumalanga' },
    { name: 'Mshadza Secondary', province: 'Mpumalanga' },
    { name: 'Northwood School', province: 'KwaZulu-Natal' },
    { name: 'Parktown Boys High School', province: 'Gauteng' },
    { name: 'Paul Roos Gymnasium', province: 'Western Cape' },
    { name: 'Phumelela Secondary', province: '' },
    { name: 'Potchefstroom Gimnasium', province: 'North West' },
    { name: 'Pretoria Boys High School', province: 'Gauteng' },
    { name: 'Rondebosch Boys High School', province: 'Western Cape' },
    { name: 'Selborne College', province: 'Eastern Cape' },
    { name: 'Shishila Secondary', province: '' },
    { name: 'Sibuyile Secondary', province: '' },
    { name: 'Sitintile Secondary', province: 'Mpumalanga' },
    { name: 'Siyabuswa Secondary', province: 'Mpumalanga' },
    { name: 'South African College High School', province: 'Western Cape' },
    { name: 'St Stithians College', province: 'Gauteng' },
    { name: 'Thulamahashe East Secondary', province: 'Mpumalanga' },
    { name: 'Thulamahashe Secondary', province: 'Mpumalanga' },
    { name: 'Westville Boys High School', province: 'KwaZulu-Natal' },
    { name: 'Witbank High School', province: 'Mpumalanga' },
    { name: 'Wynberg Boys High School', province: 'Western Cape' },
    { name: 'Zolani High School', province: '' }
];
