import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
export const runtime = 'nodejs';
export async function POST(req: Request) {
 try {
  const key=process.env.GEMINI_API_KEY;
  if(!key)return NextResponse.json({error:'Add GEMINI_API_KEY to your environment variables.'},{status:503});
  const form=await req.formData();const image=form.get('image');
  if(!(image instanceof File))return NextResponse.json({error:'Please attach a food photo.'},{status:400});
  if(image.size>8*1024*1024)return NextResponse.json({error:'Image must be smaller than 8 MB.'},{status:413});
  if(!image.type.startsWith('image/'))return NextResponse.json({error:'Upload an image file.'},{status:400});
  const bytes=Buffer.from(await image.arrayBuffer());const ai=new GoogleGenerativeAI(key);const model=ai.getGenerativeModel({model:process.env.GEMINI_MODEL||'gemini-3.8-flash'});
  const result=await model.generateContent([{text:'Identify the visible food and estimate nutrition for the visible portion. Return ONLY a valid JSON object with keys name (string), meal (Breakfast/Lunch/Dinner/Snack), calories (integer kcal), protein (grams), carbs (grams), fat (grams), fibre (grams), sugar (grams), sodium (milligrams), saturated_fat (grams). These are rough estimates; do not imply exactness. If portion size is unclear, use a typical single serving.'},{inlineData:{mimeType:image.type,data:bytes.toString('base64')}}]);
  const raw=result.response.text().replace(/```json|```/g,'').trim();const parsed=JSON.parse(raw);return NextResponse.json(parsed);
 }catch(e){return NextResponse.json({error:'Could not estimate this image. Try a clearer photo or enter the nutrition manually. Check your configured Gemini model.'},{status:500});}
}
