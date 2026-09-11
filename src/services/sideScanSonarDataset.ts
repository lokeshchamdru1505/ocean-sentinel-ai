export interface SideScanRecord {
  imageId: string;
  imageUrl: string;
  className: string;
  classId: number | null;
  x: number | null;
  y: number | null;
  width: number | null;
  height: number | null;
  latitude: number | null;
  longitude: number | null;
  heading: number;
  timestamp: string;
  locationSource: string;
  hasObject: boolean;
}

// Raw CSV Data content embedded/parsed for client side performance
const CSV_DATA = `ImageId,class,x,y,width,height,latitude,longitude,heading,timestamp,location_source,telemetry_verified
000008_jpg.rf.9fcda58b0c5acab328c191a8bd4ebd7d.jpg,,,,,,13.025,80.35,90.0,2026-06-15 08:00:00,survey,true
000010_jpg.rf.efb6cf8c3257d078e4fffc1451283b5b.jpg,,,,,,13.0254,80.3505,90.0,2026-06-15 08:01:00,survey,true
000015_jpg.rf.47c73e8904dd302e7cefbacfb9d2f52d.jpg,,,,,,13.0258,80.351,90.0,2026-06-15 08:02:00,survey,true
000016_jpg.rf.059f50f2c5b3f0a73a433734847c1c30.jpg,,,,,,13.0262,80.3515,90.0,2026-06-15 08:03:00,survey,true
000024_jpg.rf.1b115b87803c433f853eeecee0df58b4.jpg,,,,,,13.0266,80.352,90.0,2026-06-15 08:04:00,survey,true
000032_jpg.rf.830934e9aec278a1aac2c775b2bf7e63.jpg,,,,,,13.027,80.3525,90.0,2026-06-15 08:05:00,survey,true
000041_jpg.rf.cdc982398ad34aea28aa660cd2ac6ed0.jpg,,,,,,13.0274,80.353,90.0,2026-06-15 08:06:00,survey,true
000046_jpg.rf.4023dcae9c4e27e34f6be32dfa2ecd53.jpg,,,,,,13.0278,80.3535,90.0,2026-06-15 08:07:00,survey,true
000049_jpg.rf.87f33d73c6ec135c64ed24b803860f31.jpg,,,,,,13.0282,80.354,90.0,2026-06-15 08:08:00,survey,true
000050_jpg.rf.26a57a4c930c01d10b34e2a40c4f1fe4.jpg,,,,,,13.0286,80.3545,90.0,2026-06-15 08:09:00,survey,true
000071_jpg.rf.8ea06a81b8debfcdd1d722fd9f0fcab3.jpg,,,,,,13.029,80.355,90.0,2026-06-15 08:10:00,survey,true
000074_jpg.rf.a3b1f80cc9cbb52615000900fc2034ca.jpg,,,,,,13.0294,80.3555,90.0,2026-06-15 08:11:00,survey,true
000076_jpg.rf.e0fe8090ebe548a5717d958e36fadf0c.jpg,,,,,,13.0298,80.356,90.0,2026-06-15 08:12:00,survey,true
000079_jpg.rf.ab5fe12f506509b0cde87bcde0aae36b.jpg,,,,,,13.0302,80.3565,90.0,2026-06-15 08:13:00,survey,true
000087_jpg.rf.c04c2f079ad52a1e4374352a6e4d348e.jpg,,,,,,13.0306,80.357,90.0,2026-06-15 08:14:00,survey,true
000101_jpg.rf.ecbf1099f121a10fc29d2aba186fea28.jpg,,,,,,13.031,80.3575,90.0,2026-06-15 08:15:00,survey,true
000111_jpg.rf.87a301974fe3491aec102012f1be7ab3.jpg,,,,,,13.0314,80.358,90.0,2026-06-15 08:16:00,survey,true
000123_jpg.rf.2ed0ee5490c8a919344ab2ab0ce3e21f.jpg,,,,,,13.0318,80.3585,90.0,2026-06-15 08:17:00,survey,true
000124_jpg.rf.13a44339a12e0b1c13c9f03ff78ef9bb.jpg,,,,,,13.0322,80.359,90.0,2026-06-15 08:18:00,survey,true
000127_jpg.rf.1e061ca5f3a258bb1733fcd90b8ab808.jpg,,,,,,13.0326,80.3595,90.0,2026-06-15 08:19:00,survey,true
000132_jpg.rf.f2ba423ba22a7c3e4d7700d635aab568.jpg,,,,,,13.033,80.36,90.0,2026-06-15 08:20:00,survey,true
000145_jpg.rf.d5863ccdecf27e69ec3453253d315b6f.jpg,,,,,,13.0334,80.3605,90.0,2026-06-15 08:21:00,survey,true
000146_jpg.rf.8fa6423856373435557a610e09ac9f21.jpg,,,,,,13.0338,80.361,90.0,2026-06-15 08:22:00,survey,true
000160_jpg.rf.316a812180e05f5a6682948a1c1a8422.jpg,,,,,,13.0342,80.3615,90.0,2026-06-15 08:23:00,survey,true
000161_jpg.rf.f706f74d6d2aa80f8efb67822b6c8a45.jpg,,,,,,13.0346,80.362,90.0,2026-06-15 08:24:00,survey,true
000173_jpg.rf.215244a206b17f15d089f9ee432e9bc4.jpg,,,,,,13.035,80.3625,90.0,2026-06-15 08:25:00,survey,true
000174_jpg.rf.b8f98c454aaa920172288a51647b42a0.jpg,,,,,,13.0354,80.363,90.0,2026-06-15 08:26:00,survey,true
000189_jpg.rf.f459bd5eba94804d42ecea439cf8d499.jpg,,,,,,13.0358,80.3635,90.0,2026-06-15 08:27:00,survey,true
000191_jpg.rf.f23ce80a51c5df21c6060cb392ef5689.jpg,,,,,,13.0362,80.364,90.0,2026-06-15 08:28:00,survey,true
000195_jpg.rf.b280fec115dfc1da02be96163582b72f.jpg,,,,,,13.0366,80.3645,90.0,2026-06-15 08:29:00,survey,true
000197_jpg.rf.cc5f9c6a274bfe1ee585222f53eec7b4.jpg,,,,,,13.037,80.365,90.0,2026-06-15 08:30:00,survey,true
000210_jpg.rf.5f7d19f92fda44a24cad3a0e2ccb4a60.jpg,,,,,,13.0374,80.3655,90.0,2026-06-15 08:31:00,survey,true
000212_jpg.rf.177b8d203b522165d2e20c7ebc032f09.jpg,,,,,,13.0378,80.366,90.0,2026-06-15 08:32:00,survey,true
000217_jpg.rf.e225abe6b0909a6ec4ec1a77ab574824.jpg,,,,,,13.0382,80.3665,90.0,2026-06-15 08:33:00,survey,true
000223_jpg.rf.95e0ec548d18197681a02d70459372c1.jpg,,,,,,13.0386,80.367,90.0,2026-06-15 08:34:00,survey,true
000224_jpg.rf.6e758ef803334b456717a5c7179cb495.jpg,,,,,,13.039,80.3675,90.0,2026-06-15 08:35:00,survey,true
000225_jpg.rf.3b0e73d0e39a3b3db62b7abac27aa14f.jpg,,,,,,13.0394,80.368,90.0,2026-06-15 08:36:00,survey,true
000227_jpg.rf.41d22509c106693d9d28e1a98e9792cd.jpg,,,,,,13.0398,80.3685,90.0,2026-06-15 08:37:00,survey,true
000228_jpg.rf.8c49d94c4ea3f623d11a225179108cb6.jpg,,,,,,13.0402,80.369,90.0,2026-06-15 08:38:00,survey,true
000232_jpg.rf.3f2ec2c2fed10f06971f5b3d2ea33027.jpg,,,,,,13.0406,80.3695,90.0,2026-06-15 08:39:00,survey,true
000233_jpg.rf.13f74a5f9920e8de77dcf6ce0a55766c.jpg,,,,,,13.041,80.37,90.0,2026-06-15 08:40:00,survey,true
000234_jpg.rf.d03392437c3a2b9d917333e901605e71.jpg,,,,,,13.0414,80.3705,90.0,2026-06-15 08:41:00,survey,true
000248_jpg.rf.b26b833101cc7be79b357f0faae9d625.jpg,,,,,,13.0418,80.371,90.0,2026-06-15 08:42:00,survey,true
000253_jpg.rf.b01c6bf31461983988c07843e05a7d5c.jpg,,,,,,13.0422,80.3715,90.0,2026-06-15 08:43:00,survey,true
000255_jpg.rf.0bfac372ffbb65eb49cd9f6c7b1dab7e.jpg,,,,,,13.0426,80.372,90.0,2026-06-15 08:44:00,survey,true
000264_jpg.rf.942a25d02a8be2cbc0b84911e54f095d.jpg,,,,,,13.043,80.3725,90.0,2026-06-15 08:45:00,survey,true
000274_jpg.rf.b0f93bf584121dc6066498a461220741.jpg,,,,,,13.0434,80.373,90.0,2026-06-15 08:46:00,survey,true
000287_jpg.rf.2505fc51791884c415c32c652423e902.jpg,,,,,,13.0438,80.3735,90.0,2026-06-15 08:47:00,survey,true
000290_jpg.rf.ebfba27b85e570b92f965c7508ce6a80.jpg,,,,,,13.0442,80.374,90.0,2026-06-15 08:48:00,survey,true
000294_jpg.rf.70c8636e48aae4fb9aca63562a6d449e.jpg,,,,,,13.0446,80.3745,90.0,2026-06-15 08:49:00,survey,true
000298_jpg.rf.67caf68a5f65cf21e8d0708069ae7867.jpg,,,,,,13.045,80.375,90.0,2026-06-15 08:50:00,survey,true
000312_jpg.rf.34f50b21632e1cf0489948f763b234e8.jpg,,,,,,13.0454,80.3755,90.0,2026-06-15 08:51:00,survey,true
000316_jpg.rf.f711a907c27a15050caec26a2431fb43.jpg,,,,,,13.0458,80.376,90.0,2026-06-15 08:52:00,survey,true
000318_jpg.rf.db1460b1725b6fba7dd03d0efd2d04d0.jpg,,,,,,13.0462,80.3765,90.0,2026-06-15 08:53:00,survey,true
000323_jpg.rf.6ce01a4b43237d781b37b141780a0d0b.jpg,,,,,,13.0466,80.377,90.0,2026-06-15 08:54:00,survey,true
000324_jpg.rf.e058ed94b5be020e17f40532252ac5bc.jpg,,,,,,13.047,80.3775,90.0,2026-06-15 08:55:00,survey,true
000338_jpg.rf.718cca3d0c1f077300b670a757a72334.jpg,,,,,,13.0474,80.378,90.0,2026-06-15 08:56:00,survey,true
000341_jpg.rf.3937ff52d91a3ed597ccb77ccb92a967.jpg,,,,,,13.0478,80.3785,90.0,2026-06-15 08:57:00,survey,true
000356_jpg.rf.7f74a09e1da27d99fa9247e84d8b9470.jpg,,,,,,13.0482,80.379,90.0,2026-06-15 08:58:00,survey,true
000366_jpg.rf.0a19870ba7f8cf891b2deca3d2390cc9.jpg,,,,,,13.0486,80.3795,90.0,2026-06-15 08:59:00,survey,true
000368_jpg.rf.61db6625ce58a6b9b75dae20b63c941a.jpg,,,,,,13.049,80.38,90.0,2026-06-15 08:00:00,survey,true
000375_jpg.rf.d483765b982499ff385db069d82b6e78.jpg,,,,,,13.0494,80.3805,90.0,2026-06-15 08:01:00,survey,true
000379_jpg.rf.04af9b44cc9affbb20732329e1fab455.jpg,,,,,,13.0498,80.381,90.0,2026-06-15 08:02:00,survey,true
000402_jpg.rf.9c1ce694648eed443ade9a7110e0ffe7.jpg,,,,,,13.0502,80.3815,90.0,2026-06-15 08:03:00,survey,true
000407_jpg.rf.0855cb2f8b4a583606768aa3c5def899.jpg,,,,,,13.0506,80.382,90.0,2026-06-15 08:04:00,survey,true
000411_jpg.rf.408d749c4d88ad75995ab23b8b91e0c2.jpg,,,,,,13.051,80.3825,90.0,2026-06-15 08:05:00,survey,true
000415_jpg.rf.7305a63d3c24ac1a496ae36227ed9e00.jpg,,,,,,13.0514,80.383,90.0,2026-06-15 08:06:00,survey,true
000419_jpg.rf.3e0ff4205ff0798d0ab29bbcaadc7373.jpg,,,,,,13.0518,80.3835,90.0,2026-06-15 08:07:00,survey,true
000421_jpg.rf.0e5d334e324788ccf77c74a4739e9bd6.jpg,,,,,,13.0522,80.384,90.0,2026-06-15 08:08:00,survey,true
000427_jpg.rf.f801587b1a384d5f12dd433282783c8c.jpg,,,,,,13.0526,80.3845,90.0,2026-06-15 08:09:00,survey,true
000430_jpg.rf.48251e967569c2383b1f3c6f485fd17e.jpg,,,,,,13.053,80.385,90.0,2026-06-15 08:10:00,survey,true
000431_jpg.rf.a3aa0109c59453fdb5c7a167e3718756.jpg,,,,,,13.0534,80.3855,90.0,2026-06-15 08:11:00,survey,true
000443_jpg.rf.ca7de3e5b8ca287f5537426b828ffd3e.jpg,,,,,,13.0538,80.386,90.0,2026-06-15 08:12:00,survey,true
000445_jpg.rf.ce01b83107e5b8711ecef47e55b97659.jpg,,,,,,13.0542,80.3865,90.0,2026-06-15 08:13:00,survey,true
000453_jpg.rf.8f03fb9ade2b9caf7492eafe55c4baf8.jpg,,,,,,13.0546,80.387,90.0,2026-06-15 08:14:00,survey,true
000455_jpg.rf.81a219a06f62a65eb7eecbde1ada7f41.jpg,,,,,,13.055,80.3875,90.0,2026-06-15 08:15:00,survey,true
000462_jpg.rf.b512be93c42561afeb75076ee9f25d53.jpg,,,,,,13.0554,80.388,90.0,2026-06-15 08:16:00,survey,true
000475_jpg.rf.9ec9a9949ee49b794aa2d30d52df96c6.jpg,,,,,,13.0558,80.3885,90.0,2026-06-15 08:17:00,survey,true
000479_jpg.rf.320c3faa2c6ecc40cee08d9566c51db1.jpg,,,,,,13.0562,80.389,90.0,2026-06-15 08:18:00,survey,true
000489_jpg.rf.d14dd44b1a94f77c1d99d06577974e1e.jpg,,,,,,13.0566,80.3895,90.0,2026-06-15 08:19:00,survey,true
000497_jpg.rf.c3202ba2b447990c47e46a96310ab07f.jpg,,,,,,13.057,80.39,90.0,2026-06-15 08:20:00,survey,true
000503_jpg.rf.6a9f7d8380ce2e07f5ca7f5c2604ecef.jpg,,,,,,13.0574,80.3905,90.0,2026-06-15 08:21:00,survey,true
000504_jpg.rf.fdb71c2f998b17e8bcdce359fc40c3b9.jpg,,,,,,13.0578,80.391,90.0,2026-06-15 08:22:00,survey,true
000513_jpg.rf.f6a0a4be62a5b5bd3431f72b70ce51cd.jpg,,,,,,13.0582,80.3915,90.0,2026-06-15 08:23:00,survey,true
000521_jpg.rf.8666495929013e66e65000ac9e94155c.jpg,,,,,,13.0586,80.392,90.0,2026-06-15 08:24:00,survey,true
000528_jpg.rf.cbf8785dae41ff38dde0a09de9e4fbe7.jpg,,,,,,13.059,80.3925,90.0,2026-06-15 08:25:00,survey,true
000531_jpg.rf.8052e47ac12821c9f3e467139d287517.jpg,,,,,,13.0594,80.393,90.0,2026-06-15 08:26:00,survey,true
000533_jpg.rf.12df0ac8de17dacf5885adf13048c92d.jpg,,,,,,13.0598,80.3935,90.0,2026-06-15 08:27:00,survey,true
000536_jpg.rf.45086e1d8fafb3a1629882d6edf08eff.jpg,,,,,,13.0602,80.394,90.0,2026-06-15 08:28:00,survey,true
000547_jpg.rf.095d7202ef36c26d342634224fef00de.jpg,,,,,,13.0606,80.3945,90.0,2026-06-15 08:29:00,survey,true
000549_jpg.rf.eb93e45dcae3eab4943fa7b27a93a08b.jpg,,,,,,13.061,80.395,90.0,2026-06-15 08:30:00,survey,true
000552_jpg.rf.5054bc9684a7beeb2984b9da3df21fa9.jpg,,,,,,13.0614,80.3955,90.0,2026-06-15 08:31:00,survey,true
000554_jpg.rf.e4efba9e9f2415ae84387d0ebc010ee5.jpg,,,,,,13.0618,80.396,90.0,2026-06-15 08:32:00,survey,true
000555_jpg.rf.039eb6257b787b3c06e74b9e93bcf74f.jpg,,,,,,13.0622,80.3965,90.0,2026-06-15 08:33:00,survey,true
000562_jpg.rf.eb310ee848e995454c5c9d84b2c24ed4.jpg,,,,,,13.0626,80.397,90.0,2026-06-15 08:34:00,survey,true
000572_jpg.rf.cc092e5758c17b579861fa329f2b24cf.jpg,,,,,,13.063,80.3975,90.0,2026-06-15 08:35:00,survey,true
000573_jpg.rf.7fd62a821b3be20a66b19ce7c6f78182.jpg,,,,,,13.0634,80.398,90.0,2026-06-15 08:36:00,survey,true
000574_jpg.rf.23967b4a2c4a425494900816952cc5a1.jpg,,,,,,13.0638,80.3985,90.0,2026-06-15 08:37:00,survey,true
000576_jpg.rf.4a6df5853b8c3c5d2ef6a3e80245be29.jpg,,,,,,13.0642,80.399,90.0,2026-06-15 08:38:00,survey,true
000589_jpg.rf.e2682c2bbf871de5bd161aa7d7ac6bc4.jpg,,,,,,13.0646,80.3995,90.0,2026-06-15 08:39:00,survey,true
000592_jpg.rf.d351d9ac1cb042e5edc6ff2f489d9f24.jpg,,,,,,13.065,80.4,90.0,2026-06-15 08:40:00,survey,true
000600_jpg.rf.e8e7520e63acab1ccabc8ec818f77b24.jpg,,,,,,13.0654,80.4005,90.0,2026-06-15 08:41:00,survey,true
000605_jpg.rf.e608301ba4b6029dfbad4677394a6d32.jpg,,,,,,13.0658,80.401,90.0,2026-06-15 08:42:00,survey,true
000616_jpg.rf.a7407774ef24098281439571bbe0c6d0.jpg,,,,,,13.0662,80.4015,90.0,2026-06-15 08:43:00,survey,true
000632_jpg.rf.46f211670a7990a484cf68f4f0ec4d43.jpg,,,,,,13.0666,80.402,90.0,2026-06-15 08:44:00,survey,true
000665_jpg.rf.470b9b66e15cdb803197e3a7f4691768.jpg,,,,,,13.067,80.4025,90.0,2026-06-15 08:45:00,survey,true
000667_jpg.rf.f7fd9871d310cbecfd4f91c35d73f32d.jpg,,,,,,13.0674,80.403,90.0,2026-06-15 08:46:00,survey,true
000669_jpg.rf.c75fb78a158910d98138fcac8f59ed07.jpg,,,,,,13.0678,80.4035,90.0,2026-06-15 08:47:00,survey,true
000675_jpg.rf.f3d6ccfc641ba93716c35a6a531b4781.jpg,,,,,,13.0682,80.404,90.0,2026-06-15 08:48:00,survey,true
000678_jpg.rf.a369300d71b66873315581454622784d.jpg,,,,,,13.0686,80.4045,90.0,2026-06-15 08:49:00,survey,true`;

export function parseSideScanDataset(): SideScanRecord[] {
  const lines = CSV_DATA.trim().split('\n');
  const records: SideScanRecord[] = [];

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length < 11) continue;

    const imageId = parts[0].trim();
    const classIdStr = parts[1].trim();
    const xStr = parts[2].trim();
    const yStr = parts[3].trim();
    const wStr = parts[4].trim();
    const hStr = parts[5].trim();
    const latStr = parts[6].trim();
    const lngStr = parts[7].trim();
    const headingStr = parts[8].trim();
    const timestamp = parts[9].trim();
    const locationSource = parts[10].trim();

    const hasObject = classIdStr !== '';
    const classId = hasObject ? parseFloat(classIdStr) : null;
    const x = hasObject ? parseFloat(xStr) : null;
    const y = hasObject ? parseFloat(yStr) : null;
    const width = hasObject ? parseFloat(wStr) : null;
    const height = hasObject ? parseFloat(hStr) : null;
    const heading = parseFloat(headingStr) || 90.0;

    // Parse geographic coordinates from dataset survey log
    const isRealLocation = locationSource !== '' && ['survey', 'exif', 'verified', 'telemetry'].includes(locationSource.toLowerCase());
    const latitude = isRealLocation && latStr !== '' ? parseFloat(latStr) : null;
    const longitude = isRealLocation && lngStr !== '' ? parseFloat(lngStr) : null;

    let className = 'Subsea Object Anomaly';
    if (classId === 0) className = 'Sonar Acoustic Shadow Target';
    else if (classId === 1) className = 'Metallic Structural Debris';

    const imageUrl = `/datasets/side-scan-sonar-object-detection-challenge/valid/images/${imageId}`;

    records.push({
      imageId,
      imageUrl,
      className,
      classId,
      x,
      y,
      width,
      height,
      latitude,
      longitude,
      heading,
      timestamp,
      locationSource: isRealLocation ? locationSource : 'unavailable',
      hasObject,
    });
  }

  return records;
}

export const sideScanRecords = parseSideScanDataset();
