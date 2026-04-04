const fs = require('fs');

const nzData = JSON.parse(fs.readFileSync('c:\\Users\\T14s\\Desktop\\madhura\\Study-Abroad\\frontend\\data\\NewZealand Universities.json', 'utf8'));

const transformed = nzData.universities.map((uni, index) => {
    const slug = uni.university.toLowerCase().replace(/ /g, '-').replace(/[()&]/g, '');
    const id = `uni_nz_${(index + 1).toString().padStart(3, '0')}`;
    
    // Guessing domain for logo
    let domain = slug.replace('university-of-', '').replace('-university', '') + '.ac.nz';
    if (uni.university.includes('Auckland')) domain = 'auckland.ac.nz';
    if (uni.university.includes('Otago')) domain = 'otago.ac.nz';
    if (uni.university.includes('Canterbury')) domain = 'canterbury.ac.nz';
    if (uni.university.includes('Victoria')) domain = 'wgtn.ac.nz';
    if (uni.university.includes('Massey')) domain = 'massey.ac.nz';
    if (uni.university.includes('AUT') || uni.university.includes('Auckland University of Technology')) domain = 'aut.ac.nz';
    if (uni.university.includes('Waikato')) domain = 'waikato.ac.nz';
    if (uni.university.includes('Lincoln')) domain = 'lincoln.ac.nz';

    // State mapping
    const stateMap = {
        'Auckland': 'Auckland',
        'Dunedin': 'Otago',
        'Christchurch': 'Canterbury',
        'Wellington': 'Wellington',
        'Palmerston North': 'Manawatu-Wanganui',
        'Hamilton': 'Waikato',
        'Lincoln': 'Canterbury',
        'Invercargill': 'Southland',
        'Nelson': 'Nelson',
        'Rotorua': 'Bay of Plenty',
        'New Plymouth': 'Taranaki',
        'Porirua': 'Wellington'
    };

    // Mock branches
    const branchNames = [
        ["Engineering", "Business", "Science"],
        ["Medicine", "Business", "Arts"],
        ["Science", "IT & Design", "Law"],
        ["Engineering", "Business", "Communication"],
        ["Agriculture", "Business", "Science"],
        ["Design", "IT", "Business"],
        ["Engineering", "Education", "Health"]
    ];

    const currentBranchSet = branchNames[index % branchNames.length];
    
    const branches = currentBranchSet.map(bName => {
        let description = `${uni.university} offers a world-class ${bName.toLowerCase()} curriculum with a focus on innovation and sustainable development. Students benefit from state-of-the-art labs and strong industry connections in New Zealand's growing sector.`;
        if (bName === "Business") {
            description = `The business program at ${uni.university} prepares future leaders with a global perspective and practical skills. With a curriculum spanning finance, marketing, and entrepreneurship, graduates are highly sought after by top employers worldwide.`;
        } else if (bName === "Science") {
            description = `Renowned for research excellence, the Science faculty at ${uni.university} provides students with opportunities to work alongside leading experts on global challenges. From environmental science to biotechnology, the programs are designed for impact.`;
        }

        return {
            name: bName,
            description: description,
            stats: {
                acceptance_rate: uni.acceptance_rate_pct || (70 - index),
                tuition_fee: uni.annual_tuition_eur || (32000 - (index * 200)),
                living_expense: 15000,
                avg_salary: 75000 - (index * 100),
                avg_sat: 1350,
                avg_gpa: 3.5,
                avg_gre: 310
            },
            admitted_profiles: {
                toefl_min: 80,
                ielts_min: 6.5,
                toefl_avg: 92
            }
        };
    });

    return {
        _id: id,
        slug: slug,
        name: uni.university,
        logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        location: {
            city: uni.city,
            state: stateMap[uni.city] || uni.city,
            country: "New Zealand"
        },
        branches: branches,
        common_sections: {
            employment_figures: {
                employed: 85,
                employed_within_3_months: 88,
                average_salary: 72000
            },
            reviews: [
                {
                    rating: 5,
                    comment: "A prestigious institution with a stunning campus and excellent academic support."
                }
            ]
        }
    };
});

fs.writeFileSync('transformed_nz.json', JSON.stringify(transformed, null, 2));
